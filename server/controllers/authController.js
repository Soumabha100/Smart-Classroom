const User = require("../models/User");
const Parent = require("../models/Parent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");
const InvitationCode = require("../models/InvitationCode");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// =============================================================================
// 🛠️ HELPER FUNCTIONS
// =============================================================================

const generateTokens = (user, sessionId) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, sessionId }, // 👈 Embed Session ID
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id, sessionId }, // 👈 Embed Session ID
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

// 2. Helper: Create New Session in DB
// Replaces the old "updateLoginHistory" with a robust Session system.
const createSession = async (user, req) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const device = req.headers["user-agent"] || "Unknown Device";

  // Ensure sessions array exists
  if (!user.sessions) user.sessions = [];

  // Add new session
  user.sessions.push({ device, ip, lastActive: new Date() });
  await user.save();

  // Return the ID of the session we just created
  return user.sessions[user.sessions.length - 1]._id;
};

// 3. Helper: Send Response with Cookies
const sendTokenResponse = (user, sessionId, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user, sessionId);

  // We determine if we are in production
  const isProduction = process.env.NODE_ENV === "production";

  // Cookie Options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Security: JS cannot read this
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res.cookie("logged_in", "true", {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  // Sanitize user object (remove sensitive data)
  const userResponse = user.toObject ? user.toObject() : user;
  delete userResponse.password;
  delete userResponse.sessions; // Don't send entire session history on login
  delete userResponse.loginHistory; // Remove legacy field if it exists
  delete userResponse.resetPasswordToken;
  delete userResponse.resetPasswordExpire;

  res.status(statusCode).cookie("refreshToken", refreshToken, options).json({
    success: true,
    accessToken,
    user: userResponse,
  });
};

// =============================================================================
// 🎮 AUTH CONTROLLERS
// =============================================================================

exports.register = async (req, res) => {
  const { name, email, password, invitationCode } = req.body;
  try {
    // 1. Check existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email used." });
    }

    // 2. Handle Invitation Code (Preserved Old Logic with Expiry Check)
    let role = "student";
    if (invitationCode) {
      const code = await InvitationCode.findOne({
        code: invitationCode,
        used: false,
        expiresAt: { $gt: new Date() }, // ✅ Kept expiry check
      });

      if (!code) {
        return res
          .status(400)
          .json({ message: "Invalid or expired invitation code." });
      }

      role = code.role;
      code.used = true;
      await code.save();
    }

    // 3. Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // 4. Create Session & Send Token
    const sessionId = await createSession(newUser, req);
    sendTokenResponse(newUser, sessionId, 201, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User or Parent
    let user = await User.findOne({ email });
    if (!user) user = await Parent.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Create Session (Replaces updateLoginHistory)
    const sessionId = await createSession(user, req);
    sendTokenResponse(user, sessionId, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login Error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token" });

    // 1. Verify and Decode
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Find User or Parent
    let user = await User.findById(decoded.id);
    if (!user) user = await Parent.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // 3. 🔍 CRITICAL: Verify Session Exists in DB
    // This allows us to revoke access even if the token hasn't expired yet.
    const session = user.sessions && user.sessions.id(decoded.sessionId);

    if (!session) {
      // Session was revoked or deleted!
      return res.status(403).json({ message: "Session expired or revoked" });
    }

    // 4. Update "Last Active"
    session.lastActive = new Date();
    await user.save();

    // 5. Issue new Access Token (Keep same Session ID)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, sessionId: decoded.sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    console.error("Refresh failed:", err.message);
    res.status(401).json({ message: "Not authorized" });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      let user = await User.findById(decoded.id);
      if (!user) user = await Parent.findById(decoded.id);

      if (user && user.sessions) {
        // Remove ONLY the current session from DB
        user.sessions.pull(decoded.sessionId);
        await user.save();
      }
    } catch (err) {
      // Ignore token errors on logout
    }
  }

  // Clear Cookies
  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.cookie("logged_in", "none", {
    expires: new Date(Date.now() + 1000),
    httpOnly: false,
  });

  res.status(200).json({ success: true, message: "Logged out" });
};

// =============================================================================
// 🆕 SESSION MANAGEMENT CONTROLLERS
// =============================================================================

// Get all active sessions
exports.getSessions = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) user = await Parent.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mark which session is "Current"
    const sessionsWithCurrent = user.sessions.map((session) => ({
      _id: session._id,
      device: session.device,
      ip: session.ip,
      lastActive: session.lastActive,
      isCurrent: session._id.toString() === req.user.sessionId,
    }));

    res.status(200).json(sessionsWithCurrent);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Revoke a specific session
exports.revokeSession = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) user = await Parent.findById(req.user.id);

    // Remove session by ID
    if (user && user.sessions) {
      user.sessions.pull(req.params.sessionId);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Device logged out" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Revoke ALL other sessions
exports.revokeAllSessions = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) user = await Parent.findById(req.user.id);

    // Keep only the current session
    if (user && user.sessions) {
      const currentSession = user.sessions.id(req.user.sessionId);
      user.sessions = [currentSession]; // Replace array with just the current one
      await user.save();
    }

    res
      .status(200)
      .json({ success: true, message: "All other devices logged out" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// =============================================================================
// 🌐 GOOGLE AUTH (Updated with Session Logic)
// =============================================================================

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(202).json({
        message: "User not registered",
        requiresSignup: true,
        googleData: { email, name, picture, uid },
      });
    }

    // ✅ Create Session & Send Token
    const sessionId = await createSession(user, req);
    sendTokenResponse(user, sessionId, 200, res);
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

exports.completeGoogleSignup = async (req, res) => {
  const { idToken, name, role } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, picture, uid } = decodedToken;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Exists" });
    }

    const user = new User({
      name,
      email,
      password: uid,
      role: role || "student",
      profilePicture: picture,
    });
    await user.save();

    // ✅ Create Session & Send Token
    const sessionId = await createSession(user, req);
    sendTokenResponse(user, sessionId, 201, res);
  } catch (err) {
    console.error("Google Signup Error:", err);
    res.status(500).json({ message: "Signup failed." });
  }
};

// =============================================================================
// 🔑 PASSWORD RESET (Preserved Existing Logic)
// =============================================================================

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not sent" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    const clientUrl =
      process.env.CLIENT_URL || req.get("origin") || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Click below to reset your password. Valid for 10 minutes.</p>
      <a href="${resetUrl}">Reset Password</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset - IntelliClass",
        message,
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid token" });

    res.status(200).json({ success: true, message: "Valid token" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: "Password Updated" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
