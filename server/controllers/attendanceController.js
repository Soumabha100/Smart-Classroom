const jwt = require("jsonwebtoken");
const Attendance = require("../models/Attendance");

// Teacher generates a token for the QR code
exports.generateQrToken = (req, res) => {
  const payload = {
    classId: req.body.classId, // e.g., "CSE-501"
    timestamp: Date.now(),
  };
  // This token is short-lived (e.g., 30 seconds)
  const qrToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });
  res.json({ qrToken });
};

// Student marks their attendance
exports.markAttendance = async (req, res) => {
  const { qrToken } = req.body;
  try {
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);

    const newAttendance = new Attendance({
      studentId: req.user.id,
      classId: decoded.classId,
    });
    await newAttendance.save();

    // Find the student's name to send in the payload
    const student = await User.findById(req.user.id).select("name");

    // Prepare payload for WebSocket emission
    const attendanceData = {
      student_name: student.name,
      timestamp: newAttendance.timestamp.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
      status: newAttendance.status,
    };

    // ** Emit event to all connected clients
    req.io.emit("new_attendance", attendanceData);

    res.status(201).json({ message: "Attendance marked successfully!" });
  } catch (error) {
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
