const router = require("express").Router();
const {
  generateQrToken,
  markAttendance,
  getAttendanceAnalytics,
  getStudentAttendance, // ✨ Import the new controller
} = require("../controllers/attendanceController");

const { verifyToken } = require("../middlewares/authMiddleware");
const  checkRole  = require("../middlewares/checkRole");

// Teacher routes
router.post("/generate-qr", verifyToken, checkRole, generateQrToken);
router.get("/analytics", verifyToken, checkRole, getAttendanceAnalytics);

// Student routes
router.post("/mark", verifyToken, markAttendance);
// ✨ ADDED: New route for a student to get their own attendance history
router.get("/student", verifyToken, getStudentAttendance);

module.exports = router;
