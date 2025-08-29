const User = require("../models/User");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // The user ID is attached to the request by the verifyToken middleware
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from the result
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile = { ...user.profile, ...req.body };
    await user.save();

    res.status(200).json(user.profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get User Count
exports.getUserCount = async (req, res) => {
  try {
    const { role } = req.query; // Gets role from the URL (e.g., ?role=admin)
    if (!["admin", "teacher", "student", "parent"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    const count = await User.countDocuments({ role });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
