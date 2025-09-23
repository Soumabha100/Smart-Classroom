const router = require("express").Router();

// controllers — adjust path if needed
const {
  generateQrCode,
  markAttendance,
  getAttendanceAnalytics,
  getStudentAttendance,
} = require("../controllers/attendanceController");

// middlewares
const { verifyToken } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRole");

// routes (call checkRole(...) — it's a factory that returns a middleware)
router.post("/generate-qr", verifyToken, checkRole(["teacher"]), generateQrCode);
router.get("/analytics", verifyToken, checkRole(["teacher"]), getAttendanceAnalytics);

// Student routes
router.post("/mark", verifyToken, checkRole(["student"]), markAttendance);
router.get("/student", verifyToken, checkRole(["student"]), getStudentAttendance);

module.exports = router;
