const User = require("../models/User");
const Parent = require("../models/Parent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase"); // Import the firebase setup
const InvitationCode = require("../models/InvitationCode");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// --- 🛠️ HELPER: Track Login & Generate Token ---
const handleLoginSuccess = async (user, req, res, statusCode = 200) => {
  try {
    // 1. Capture Device Info
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const device = req.headers["user-agent"];

    // 2. Update Login History (Limit to last 10 entries to save space)
    // We use $push to add to array, and $slice to keep only the last 10
    await User.findByIdAndUpdate(user._id, {
      $push: {
        loginHistory: {
          $each: [{ ip, device, loginAt: new Date() }],
          $position: 0, // Add to top
          $slice: 10, // Keep only top 10
        },
      },
    });

    // 3. Generate Token (Extended to 7 days)
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d", // ⏳ Extended from 24h to 7 days
    });

    // 4. Send Response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.loginHistory; // Don't send history to frontend on login

    res.status(statusCode).json({
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("Login Success Handler Error:", err);
    res.status(500).json({ message: "Failed to complete login." });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, invitationCode } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use." });
    }

    let role = "student"; // Default role

    // If an invitation code is provided, validate it
    if (invitationCode) {
      const code = await InvitationCode.findOne({
        code: invitationCode,
        used: false,
        expiresAt: { $gt: new Date() }, // Check if not expired
      });

      if (!code) {
        return res
          .status(400)
          .json({ message: "Invalid or expired invitation code." });
      }

      role = code.role; // Assign role from the code
      code.used = true; // Mark code as used
      await code.save();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: `Registration successful! You have been registered as a ${role}.`,
      user: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// --- NEW UNIFIED LOGIN LOGIC (FIXED) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    let isParent = false;

    // If not found in Users, check Parents collection
    if (!user) {
      user = await Parent.findOne({ email });
      isParent = true;
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // ✅ USE THE HELPER
    await handleLoginSuccess(user, req, res, 200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- GOOGLE LOGIN (Check User Step) ---
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // STOP! Don't create account yet.
      // Send 202 Accepted to tell frontend to show the "Complete Profile" page.
      return res.status(202).json({
        message: "User not registered",
        requiresSignup: true,
        googleData: {
          email,
          name, // Google's default name
          picture,
          uid, // We'll use this to verify again later
        },
      });
    }

    // If user exists, proceed with normal login
    // ✅ USE THE HELPER
    await handleLoginSuccess(user, req, res, 200);
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

// --- GOOGLE SIGNUP (Complete Profile Step) ---
exports.completeGoogleSignup = async (req, res) => {
  const { idToken, name, role } = req.body; // User's EDITED name

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, picture, uid } = decodedToken;

    // Double check user doesn't exist
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create the user with the CUSTOM name
    const user = new User({
      name: name, // Uses the name from the form
      email: email,
      password: uid, // Placeholder
      role: role || "student",
      profilePicture: picture,
    });

    await user.save();

    // ✅ USE THE HELPER (Use status 201 for creation)
    await handleLoginSuccess(user, req, res, 201);
  } catch (err) {
    console.error("Google Signup Error:", err);
    res.status(500).json({ message: "Signup failed." });
  }
};

// --- 🔑 FORGOT PASSWORD (User requests reset link) ---
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not sent" }); // Generic message for security
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create Reset URL
    // NOTE: Change localhost to your frontend domain in production
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
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
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 🔑 RESET PASSWORD (User sets new password) ---
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

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: "Password Updated Success" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
