// server/controllers/attendanceController.js

const mongoose = require("mongoose");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const crypto = require("crypto");

// Safely attempt to load a socket helper. If it doesn't exist, we fall back to a no-op.
let getIo = () => null;
try {
  // require may throw if ../socket.js doesn't exist
  const socketModule = require("../socket");
  // support both named export getIo and default export
  if (socketModule && typeof socketModule.getIo === "function") {
    getIo = socketModule.getIo;
  } else if (typeof socketModule === "function") {
    getIo = socketModule;
  }
} catch (err) {
  // If socket module not present, just warn and continue — we won't emit any events.
  /* eslint-disable no-console */
  console.warn(
    "[attendanceController] socket module not found; websocket notifications disabled."
  );
  /* eslint-enable no-console */
}

// In-memory store for short-lived QR tokens (fast; resets on server restart)
const qrTokenStore = new Map();

/**
 * Generate a QR token for attendance (teacher-only)
 * POST /api/attendance/generate-qr
 */
async function generateQrCode(req, res) {
  const { classId } = req.body;
  const teacherId = req.user && req.user.id;

  if (!classId) {
    return res.status(400).json({ message: "classId is required" });
  }

  // --- DEBUG PROBE 1 ---
  console.log(`\n--- TEACHER ACTION: GENERATE QR ---`);
  console.log(
    `[TEACHER] Received request to generate QR for Class ID: ${classId}`
  );
  // --- END PROBE ---

  try {
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (targetClass.teacher && targetClass.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: not the class teacher" });
    }

    const qrToken = crypto.randomBytes(20).toString("hex");
    const expiry = Date.now() + 2 * 60 * 1000; // 2 minutes

    qrTokenStore.set(qrToken, { classId: classId.toString(), expiry });

    // --- DEBUG PROBE 2 ---
    console.log(
      `[TEACHER] Stored token. Associated Class ID: ${classId.toString()}`
    );
    console.log(`-------------------------------------\n`);
    // --- END PROBE ---

    for (const [token, data] of qrTokenStore.entries()) {
      if (data.classId === classId.toString() && token !== qrToken) {
        qrTokenStore.delete(token);
      }
    }

    return res.status(200).json({
      message: "QR token generated",
      qrToken,
      expiresAt: new Date(expiry).toISOString(),
    });
  } catch (error) {
    console.error("[generateQrCode] error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Mark attendance (student)
 * POST /api/attendance/mark
 * Body: { qrToken, classId }
 */
async function markAttendance(req, res) {
  const { qrToken, classId } = req.body;
  const studentId = req.user && req.user.id;

  // --- DEBUG PROBE 3 ---
  console.log(`\n--- STUDENT ACTION: MARK ATTENDANCE ---`);
  console.log(`[STUDENT] Received scan request.`);
  console.log(`[STUDENT] QR Token from app: ${qrToken}`);
  console.log(
    `[STUDENT] Class ID from app: ${classId} (Type: ${typeof classId})`
  );
  // --- END PROBE ---

  if (!qrToken || !classId) {
    return res
      .status(400)
      .json({ message: "qrToken and classId are required" });
  }

  try {
    const tokenData = qrTokenStore.get(qrToken);

    if (!tokenData) {
      return res.status(400).json({ message: "Invalid QR token" });
    }

    if (Date.now() > tokenData.expiry) {
      qrTokenStore.delete(qrToken);
      return res.status(400).json({ message: "QR token expired" });
    }

    // --- DEBUG PROBE 4 ---
    console.log(
      `[SERVER] Class ID stored in token: ${
        tokenData.classId
      } (Type: ${typeof tokenData.classId})`
    );
    console.log(
      `[SERVER] Comparing -> Stored: "${
        tokenData.classId
      }" | Received: "${classId.toString()}"`
    );
    console.log(`---------------------------------------\n`);
    // --- END PROBE ---

    if (tokenData.classId !== classId.toString()) {
      return res
        .status(400)
        .json({ message: "QR token does not match selected class" });
    }

    const targetClass = await Class.findOne({
      _id: classId,
      students: studentId,
    }).select("name");
    if (!targetClass) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this class" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      studentId: studentId,
      classId: classId,
      timestamp: { $gte: today },
    });

    if (existing) {
      return res.status(409).json({
        message: `Attendance already marked for ${targetClass.name} today`,
      });
    }

    const record = new Attendance({
      studentId: studentId,
      classId: classId,
      status: "Present",
      timestamp: new Date(),
    });
    await record.save();

    qrTokenStore.delete(qrToken);

    try {
      const io = getIo();
      if (io) {
        const student = await User.findById(studentId).select("name").lean();
        io.emit("new_attendance", {
          student_name: student ? student.name : studentId,
          class_name: targetClass.name || classId,
          timestamp: new Date(),
          status: "Present",
        });
      }
    } catch (socketErr) {
      console.warn(
        "[markAttendance] socket emit failed:",
        socketErr && socketErr.message
      );
    }

    return res
      .status(201)
      .json({ message: `Attendance marked for ${targetClass.name}` });
  } catch (error) {
    console.error("[markAttendance] error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Get attendance analytics (teacher)
 * GET /api/attendance/analytics?classId=...&from=...&to=...
 */
async function getAttendanceAnalytics(req, res) {
  const { classId, from, to } = req.query;
  const teacherId = req.user && req.user.id; // Assuming teacher context

  if (!classId) {
    return res.status(400).json({ message: "classId query param is required" });
  }

  try {
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    // Optional: Ensure teacher owns the class for analytics
    if (targetClass.teacher && targetClass.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not teach this class." });
    }

    const match = { classId: mongoose.Types.ObjectId(classId) };
    if (from || to) {
      match.timestamp = {};
      if (from) match.timestamp.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        match.timestamp.$lte = toDate;
      }
    }

    // Total attendance records for the class within the period
    const totalRecords = await Attendance.countDocuments(match);
    const totalPresent = await Attendance.countDocuments({
      ...match,
      status: "Present",
    });
    const attendancePercentage =
      totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(2) : 0;

    // Attendance by Student
    const byStudent = await Attendance.aggregate([
      { $match: { ...match, status: "Present" } },
      { $group: { _id: "$studentId", presentCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "users", // Your users collection name
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

    // Daily Attendance Count (for a line chart or bar chart)
    const byDay = await Attendance.aggregate([
      { $match: { ...match, status: "Present" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent Attendance Logs (detailed list)
    const recentLogs = await Attendance.find(match)
      .populate("studentId", "name email")
      .sort({ timestamp: -1 })
      .limit(20) // Limit to recent 20 logs for display
      .lean();

    return res.status(200).json({
      classId: targetClass._id,
      className: targetClass.name,
      totalRecords,
      totalPresent,
      attendancePercentage,
      byStudent,
      byDay,
      recentLogs,
    });
  } catch (error) {
    console.error("[getAttendanceAnalytics] error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Get attendance records for current student
 * GET /api/attendance/student
 */
async function getStudentAttendance(req, res) {
  const studentId = req.user && req.user.id;
  try {
    const records = await Attendance.find({ studentId: studentId })
      .populate("classId", "name subject") // Populating classId to get class details
      .sort({ timestamp: -1 })
      .lean();

    // Calculate total attendance percentage for the student across all classes
    const totalStudentAttendance = await Attendance.countDocuments({
      studentId,
    });
    const studentPresentCount = await Attendance.countDocuments({
      studentId,
      status: "Present",
    });
    const overallStudentAttendancePercentage =
      totalStudentAttendance > 0
        ? ((studentPresentCount / totalStudentAttendance) * 100).toFixed(2)
        : 0;

    return res.status(200).json({
      records,
      overallAttendancePercentage: overallStudentAttendancePercentage,
    });
  } catch (error) {
    console.error("[getStudentAttendance] error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  generateQrCode,
  markAttendance,
  getAttendanceAnalytics,
  getStudentAttendance,
};
