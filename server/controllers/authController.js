const User = require("../models/User");
const Parent = require("../models/Parent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const InvitationCode = require("../models/InvitationCode");

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

    // Create JWT payload
    const payload = {
      id: user._id,
      role: user.role,
      ...(isParent && { students: user.students }),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h", // Extended to 24h for better UX
    });

    // --- FIX: Send the full user object (excluding password) ---
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      token,
      user: userResponse, // <--- This was missing! The app needs this.
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
