const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const crypto = require("crypto");

// ---------------- existing functions ----------------

// @desc    Generate a QR code for attendance
// @route   POST /api/attendance/generate-qr
// @access  Private (Teacher)
async function generateQrCode(req, res) {
  const { classId } = req.body;

  if (!classId) {
    return res.status(400).json({ message: "Class ID is required" });
  }

  try {
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const qrToken = crypto.randomBytes(20).toString("hex");
    const qrTokenExpires = new Date(Date.now() + 2 * 60 * 1000);

    targetClass.qrToken = qrToken;
    targetClass.qrTokenExpires = qrTokenExpires;
    await targetClass.save();

    res.status(200).json({
      message: "QR Code generated successfully",
      qrToken,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Mark attendance by scanning a QR code
// @route   POST /api/attendance/mark
// @access  Private (Student)
async function markAttendance(req, res) {
  const { qrToken } = req.body;
  const studentId = req.user.id; // From auth middleware

  if (!qrToken) {
    return res.status(400).json({ message: "QR token is required" });
  }

  try {
    const targetClass = await Class.findOne({
      qrToken: qrToken,
      qrTokenExpires: { $gt: Date.now() },
    });

    if (!targetClass) {
      return res.status(400).json({ message: "Invalid or expired QR code" });
    }

    if (!targetClass.students.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this class." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      class: targetClass._id,
      timestamp: { $gte: today },
    });

    if (existingAttendance) {
      return res
        .status(409)
        .json({ message: "Attendance already marked for this class today" });
    }

    const newAttendance = new Attendance({
      student: studentId,
      class: targetClass._id,
      status: "Present",
    });

    await newAttendance.save();

    // invalidate token
    targetClass.qrToken = undefined;
    targetClass.qrTokenExpires = undefined;
    await targetClass.save();

    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
}


// @desc    Get attendance analytics for a class (teacher only)
// @route   GET /api/attendance/analytics?classId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
// @access  Private (Teacher)
async function getAttendanceAnalytics(req, res) {
  const { classId, from, to } = req.query;

  if (!classId) {
    return res.status(400).json({ message: "classId query param is required" });
  }

  try {
    // Build date range if provided
    const match = { class: classId };
    if (from || to) {
      match.timestamp = {};
      if (from) match.timestamp.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        // include the whole day for 'to'
        toDate.setHours(23, 59, 59, 999);
        match.timestamp.$lte = toDate;
      }
    }

    // Simple aggregation: count presents per student, and total present count per day
    const totalPresent = await Attendance.countDocuments({
      ...match,
      status: "Present",
    });

    const byStudent = await Attendance.aggregate([
      { $match: match },
      { $match: { status: "Present" } },
      {
        $group: {
          _id: "$student",
          presentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          studentId: "$_id",
          presentCount: 1,
          studentName: "$studentInfo.name",
          studentEmail: "$studentInfo.email",
        },
      },
      { $sort: { presentCount: -1 } },
    ]);

    // Attendance per day (optional)
    const byDay = await Attendance.aggregate([
      { $match: match },
      { $match: { status: "Present" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      totalPresent,
      byStudent,
      byDay,
    });
  } catch (error) {
    console.error("Error getting attendance analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get current student's attendance history
// @route   GET /api/attendance/student
// @access  Private (Student)
async function getStudentAttendance(req, res) {
  const studentId = req.user.id;

  try {
    const records = await Attendance.find({ student: studentId })
      .populate("class", "name") // populate class name if your Class model has 'name'
      .sort({ timestamp: -1 })
      .lean();

    res.status(200).json({ records });
  } catch (error) {
    console.error("Error getting student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ---------------- exports ----------------
module.exports = {
  generateQrCode,
  markAttendance,
  getAttendanceAnalytics,
  getStudentAttendance,
};
