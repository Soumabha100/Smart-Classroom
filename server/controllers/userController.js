const User = require("../models/User");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Attendance = require("../models/Attendance");

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
    const { name, phone, bio, theme } = req.body;
    const userId = req.user.id;

    // 1. Build the update object dynamically
    // We use dot notation for nested fields ("profile.theme") so we don't overwrite the whole profile
    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (bio !== undefined) updateFields.bio = bio;

    // ✨ FIX: Handle theme update explicitly using MongoDB dot notation
    // This works even if 'profile' doesn't exist yet!
    if (theme) {
      updateFields["profile.theme"] = theme;
    }

    // 2. Use findByIdAndUpdate for an atomic, safe update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the new user & validate
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(
      `✅ User ${updatedUser.email} updated. Theme is now: ${updatedUser.profile?.theme}`
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
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

// Get Students (General Purpose)
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "_id name email"
    );
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// ✨ FIX: This function is now correctly defined and exported.
// @desc    Get all users with the role of student (for Admin)
// @route   GET /api/users/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "_id name email"
    );
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server Error" });
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

// Get Teacher Analytics
exports.getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacher: teacherId });
    const classCount = classes.length;

    if (classCount === 0) {
      return res.json({
        classCount: 0,
        studentCount: 0,
        assignmentCount: 0,
        submissionRate: "0.00",
        attendanceRate: "0.00",
      });
    }

    const classIds = classes.map((c) => c._id);
    const studentCount = await User.countDocuments({
      role: "student",
      classes: { $in: classIds },
    });
    const assignments = await Assignment.find({ class: { $in: classIds } });
    const assignmentCount = assignments.length;

    const submissionCount = await Submission.countDocuments({
      assignmentId: { $in: assignments.map((a) => a._id) },
    });

    const totalPossibleSubmissions = assignmentCount * studentCount;
    const submissionRate =
      totalPossibleSubmissions > 0
        ? (submissionCount / totalPossibleSubmissions) * 100
        : 0;

    const attendanceRecords = await Attendance.find({
      classId: { $in: classIds },
    });
    const totalAttendance = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (a) => a.status === "Present"
    ).length;
    const attendanceRate =
      totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    res.json({
      classCount,
      studentCount,
      assignmentCount,
      submissionRate: submissionRate.toFixed(2),
      attendanceRate: attendanceRate.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching teacher analytics:", error);
    res.status(500).json({ message: "Server error while fetching analytics" });
  }
};

// --- Change Password Controller ---
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role; // Assuming authMiddleware attaches this

  try {
    // 1. Determine which collection to search based on role
    let user;
    const Parent = require("../models/Parent");
    const bcrypt = require("bcryptjs");

    if (userRole === "parent") {
      user = await Parent.findById(userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // 3. Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 4. Save
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Server error while updating password." });
  }
};
