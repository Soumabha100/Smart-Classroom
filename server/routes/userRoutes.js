const router = require("express").Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserCount,
  getTeachers,
  getStudents,
  getStudentDataForParent,
  getTeacherAnalytics,
} = require("../controllers/userController");

// import both middlewares from authMiddleware in one line
const { verifyToken, protect } = require("../middlewares/authMiddleware");

// import checkRole factory (you must call it with allowed roles)
const checkRole = require("../middlewares/checkRole");

// Profile routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

// Counts and lists
router.get("/count", verifyToken, getUserCount);
router.get("/teachers", verifyToken, getTeachers);
router.get("/students", verifyToken, getStudents);
router.get("/parent", verifyToken, getStudentDataForParent);

// Teacher analytics — protect + role check
router.get(
  "/teacher/analytics",
  protect,
  checkRole(["teacher"]),
  getTeacherAnalytics
);

module.exports = router;
