const InvitationCode = require("../models/InvitationCode");
const crypto = require("crypto");

// @desc    Generate a new invitation code
// @route   POST /api/invites/generate
// @access  Private (Admin)
exports.generateInvite = async (req, res) => {
  try {
    const code = crypto.randomBytes(8).toString("hex"); // Generate a random 16-char code
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Code is valid for 7 days

    const newCode = new InvitationCode({
      code,
      role: "teacher", // Hardcoded to teacher for now
      expiresAt,
    });

    await newCode.save();
    res.status(201).json(newCode);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Get all active invitation codes
// @route   GET /api/invites
// @access  Private (Admin)
exports.getInvites = async (req, res) => {
  try {
    const codes = await InvitationCode.find({
      used: false,
      expiresAt: { $gt: new Date() },
    });
    res.status(200).json(codes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
