const router = require("express").Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserCount,
  getTeachers,
  getStudents, // Your original function, untouched
  getStudentDataForParent,
  getTeacherAnalytics,
  getAllStudents, // The admin-specific function
} = require("../controllers/userController");

const { verifyToken, protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRole");

// Profile routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

// Counts and lists
router.get("/count", verifyToken, getUserCount);
router.get("/teachers", verifyToken, getTeachers);
router.get("/parent", verifyToken, getStudentDataForParent);

// ✨ FIX: Renamed the admin-specific route to "/all-students" to make it unique.
// The frontend will now call this new, unambiguous route.
router.get("/all-students", protect, checkRole(["admin"]), getAllStudents);

// Your original /students route is preserved and untouched for other parts of the app
router.get("/students", verifyToken, getStudents);

// Teacher analytics — protect + role check
router.get(
  "/teacher/analytics",
  protect,
  checkRole(["teacher"]),
  getTeacherAnalytics
);

module.exports = router;
