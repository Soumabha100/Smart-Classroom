const router = require("express").Router();
const {
  getClasses,
  createClass,
  addStudentToClass,
  updateClass,
  deleteClass,
  getClassById,
  getTeacherClasses,
} = require("../controllers/classController");


const { verifyToken } = require("../middlewares/authMiddleware");

// --- THIS IS THE FIX ---
// We now import the 'checkRole' function directly as a default export,
// which matches our corrected 'checkRole.js' file.
const checkRole = require("../middlewares/checkRole");
// --- END OF FIX ---



// @desc    Get all classes (for Admins)
router.get("/", verifyToken, checkRole(["admin"]), getClasses);

// @desc    Create a new class (for Admins AND Teachers)
router.post("/", verifyToken, checkRole(["admin", "teacher"]), createClass);

// @desc    Get classes for the logged-in teacher
router.get(
  "/my-classes",
  verifyToken,
  checkRole(["teacher"]),
  getTeacherClasses
);

// @desc    Get a single class by its ID
router.get(
  "/:classId",
  verifyToken,
  checkRole(["admin", "teacher"]),
  getClassById
);

// @desc    Add a student to a class (for Admins)
router.post(
  "/:classId/students",
  verifyToken,
  checkRole(["admin"]),
  addStudentToClass
);

// @desc    Update a class (for Admins and the class's own Teacher)
router.put(
  "/:classId",
  verifyToken,
  checkRole(["admin", "teacher"]),
  updateClass
);

// @desc    Delete a class (for Admins and the class's own Teacher)
router.delete(
  "/:classId",
  verifyToken,
  checkRole(["admin", "teacher"]),
  deleteClass
);

module.exports = router;
