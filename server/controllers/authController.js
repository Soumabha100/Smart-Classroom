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

// --- NEW UNIFIED LOGIN LOGIC (UPDATED) ---
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

    // --- CHANGE 1: SPECIFIC USER NOT FOUND ERROR ---
    // If user is still not found, send a 404 "Not Found"
    if (!user) {
      // We use 404 (Not Found) for a missing resource (the user account)
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // --- CHANGE 2: SPECIFIC WRONG PASSWORD ERROR ---
    if (!isMatch) {
      // We use 401 (Unauthorized) for a failed auth attempt
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again." });
    }

    // --- (Original success logic is unchanged) ---
    // Create JWT payload
    const payload = {
      id: user._id,
      role: user.role,
      // Add student IDs to token if the user is a parent
      ...(isParent && { students: user.students }),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Industry standard is 1h to 24h
    });

    res.status(200).json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    // Send a generic 500 for all other unexpected server errors
    console.error(err); // Log the error for you, not the user
    res.status(500).json({ message: "Server Error. Please try again later." });
    throw err;
  }
};
