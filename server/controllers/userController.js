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

// --- THIS IS THE NEW FUNCTION YOU MUST ADD ---
exports.getTeacherAnalytics = async (req, res) => {
  try {
    // req.user.id is automatically added by your auth middleware
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

    // Use 'assignmentId' based on your Submission.js model
    const submissionCount = await Submission.countDocuments({
      assignmentId: { $in: assignments.map((a) => a._id) },
    });

    const totalPossibleSubmissions = assignmentCount * studentCount;
    const submissionRate =
      totalPossibleSubmissions > 0
        ? (submissionCount / totalPossibleSubmissions) * 100
        : 0;

    // Use 'classId' based on your Attendance.js model
    const attendanceRecords = await Attendance.find({
      classId: { $in: classIds },
    });
    const totalAttendance = attendanceRecords.length;
    // Use 'Present' (capitalized) based on your Attendance.js model
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
