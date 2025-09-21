const User = require("../models/User");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
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

    user.name = req.body.name || user.name;
    user.phone = req.body.phone;
    user.bio = req.body.bio;

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get User Count
exports.getUserCount = async (req, res) => {
  try {
    const { role } = req.query;
    if (!["admin", "teacher", "student", "parent"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    const count = await User.countDocuments({ role });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get Teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name");
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get Students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get Student Data for Parent
exports.getStudentDataForParent = async (req, res) => {
  try {
    const studentIds = req.user.students;
    if (!studentIds || studentIds.length === 0) {
      return res.json([]);
    }
    const students = await User.find({ _id: { $in: studentIds } }).select(
      "-password"
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
