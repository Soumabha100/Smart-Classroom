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

// 1. Generate Access & Refresh Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Long-lived
  );

  return { accessToken, refreshToken };
};

// 2. Update Login History (IP & Device)
const updateLoginHistory = async (user, req) => {
  // Only 'User' model has loginHistory currently, Parent might not.
  // We check if the field exists in the schema or document before updating.
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const device = req.headers["user-agent"];

    // We use findByIdAndUpdate on the specific collection
    if (user.role !== "parent") {
      await User.findByIdAndUpdate(user._id, {
        $push: {
          loginHistory: {
            $each: [{ ip, device, loginAt: new Date() }],
            $position: 0,
            $slice: 10, // Keep last 10
          },
        },
      });
    }
  } catch (error) {
    console.error("Failed to update login history:", error.message);
    // Don't block login if this fails
  }
};

// 3. Send Standardized Auth Response (Cookie + JSON)
const sendTokenResponse = (user, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Security: JS cannot read this
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",
  };

  // Sanitize user object (remove password/history)
  const userResponse = user.toObject ? user.toObject() : user;
  delete userResponse.password;
  delete userResponse.loginHistory;
  delete userResponse.resetPasswordToken;
  delete userResponse.resetPasswordExpire;

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      accessToken,
      user: userResponse,
    });
};

// =============================================================================
// 🎮 AUTH CONTROLLERS
// =============================================================================

// --- Register (Standard) ---
exports.register = async (req, res) => {
  const { name, email, password, invitationCode } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use." });
    }

    let role = "student"; // Default

    // Validate Invitation Code
    if (invitationCode) {
      const code = await InvitationCode.findOne({
        code: invitationCode,
        used: false,
        expiresAt: { $gt: new Date() },
      });

      if (!code) {
        return res.status(400).json({ message: "Invalid or expired invitation code." });
      }

      role = code.role;
      code.used = true;
      await code.save();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    const savedUser = await newUser.save();

    // Note: We don't auto-login on register here to verify email flow if needed,
    // but you can call sendTokenResponse(savedUser, 201, res) if you prefer auto-login.
    res.status(201).json({
      message: `Registration successful! You can now login.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// --- Login (Unified for User & Parent) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find User or Parent
    let user = await User.findOne({ email });
    if (!user) {
      user = await Parent.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // 3. Update History & Send Token
    await updateLoginHistory(user, req);
    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- Refresh Token (The Heart of the new System) ---
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 1. Verify Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Find User OR Parent
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Parent.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3. Issue NEW Access Token (Keep Refresh Token alive)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    // If verification fails (expired/invalid), force logout
    console.error("Refresh Error:", err.message);
    res.status(401).json({ message: "Token failed" });
  }
};

// --- Logout ---
exports.logout = async (req, res) => {
  // Clear the cookie immediately
  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// --- Google Login (Check) ---
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

    // Login Exists -> Update History & Send Token
    await updateLoginHistory(user, req);
    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

// --- Google Signup (Complete) ---
exports.completeGoogleSignup = async (req, res) => {
  const { idToken, name, role } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, picture, uid } = decodedToken;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = new User({
      name: name,
      email: email,
      password: uid, // Placeholder
      role: role || "student",
      profilePicture: picture,
    });

    await user.save();

    // New User -> Update History & Send Token (Auto-Login)
    await updateLoginHistory(user, req);
    sendTokenResponse(user, 201, res);

  } catch (err) {
    console.error("Google Signup Error:", err);
    res.status(500).json({ message: "Signup failed." });
  }
};

// =============================================================================
// 🔑 PASSWORD RESET (Standard)
// =============================================================================

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not sent" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    const clientUrl = process.env.CLIENT_URL || req.get("origin") || "http://localhost:5173";
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
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: "Invalid token" });

    res.status(200).json({ success: true, message: "Valid token" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
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