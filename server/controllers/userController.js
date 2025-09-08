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

    // This allows updating any part of the profile, including the new 'theme'
    const updatedProfile = { ...user.profile, ...req.body };
    user.profile = updatedProfile;

    await user.save();

    // Return the updated user object (excluding password)
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
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

// Get All the User Count
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name");
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.getStudentDataForParent = async (req, res) => {
  try {
    // req.user.students comes from the parent's JWT token
    const studentIds = req.user.students;
    if (!studentIds || studentIds.length === 0) {
      return res.json([]);
    }
    const students = await User.find({ _id: { $in: studentIds } }).select(
      "-password"
    );
    // You can also populate attendance records here later
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
