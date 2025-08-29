const jwt = require("jsonwebtoken");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Teacher generates a token for the QR code
exports.generateQrToken = (req, res) => {
  const payload = {
    classId: req.body.classId,
    timestamp: Date.now(),
  };
  const qrToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });
  res.json({ qrToken });
};

// Student marks their attendance
// Student marks their attendance
exports.markAttendance = async (req, res) => {
  const { qrToken } = req.body;
  try {
    // ✅ Add clockTolerance to the verification options
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET, {
      clockTolerance: 10, // 10 seconds grace period
    });

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const existingAttendance = await Attendance.findOne({
      studentId: req.user.id,
      classId: decoded.classId,
      timestamp: { $gte: twoHoursAgo },
    });

    if (existingAttendance) {
      return res
        .status(409)
        .json({ message: "Attendance already marked for this session." });
    }

    const newAttendance = new Attendance({
      studentId: req.user.id,
      classId: decoded.classId,
    });
    await newAttendance.save();

    const student = await User.findById(req.user.id).select("name");

    const attendanceData = {
      student_name: student.name,
      timestamp: newAttendance.timestamp.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
      status: newAttendance.status,
    };

    req.io.emit("new_attendance", attendanceData);

    res.status(201).json({ message: "Attendance marked successfully!" });
  } catch (error) {
    // This will now correctly catch actual expired tokens or other errors
    res.status(400).json({ message: "Invalid or expired QR code." });
  }
};

// Add this new function to attendanceController.js

// @desc    Get attendance analytics
// @route   GET /api/attendance/analytics
// @access  Private (Teacher)
exports.getAttendanceAnalytics = async (req, res) => {
  try {
    const analytics = await Attendance.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: "$count",
        },
      },
    ]);
    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
