const router = require("express").Router();
const {
  getClasses,
  createClass,
  addStudentToClass,
  updateClass,
  deleteClass,
  getClassById,
  getTeacherClasses,
  getStudentClasses,
  getAllClasses, // ✨ Import the new controller
  removeStudentFromClass, // Import for admin functionality
  assignTeacherToClass    // Import for admin functionality
} = require("../controllers/classController");

const { verifyToken, protect } = require("../middlewares/authMiddleware"); // Using protect for consistency
const  checkRole  = require("../middlewares/checkRole");

// --- Define Routes ---

// GET /api/classes/all -> Get all classes (ADMIN ONLY)
// ✨ THIS IS THE NEW ROUTE THAT FIXES THE ERROR
router.get(
  "/all",
  protect,
  checkRole(["admin"]),
  getAllClasses
);

// GET /api/classes -> Get classes based on user role (student/teacher)
router.get("/", protect, getClasses);

// POST /api/classes -> Create a new class (Admin & Teacher)
router.post("/", protect, checkRole(["admin", "teacher"]), createClass);

// GET /api/classes/student -> Get classes for the logged-in student
// This might be redundant if the main GET /api/classes handles it, but keeping for clarity
router.get("/student", protect, checkRole(["student"]), getStudentClasses);

// GET /api/classes/my-classes -> Get classes for the logged-in teacher
router.get(
  "/my-classes",
  protect,
  checkRole(["teacher"]),
  getTeacherClasses
);

// --- Routes for a specific class ID ---

// GET /api/classes/:id -> Get a single class by its ID
router.get(
  "/:id",
  protect,
  checkRole(["admin", "teacher"]),
  getClassById
);

// PUT /api/classes/:id -> Update a class
router.put(
  "/:id",
  protect,
  checkRole(["admin", "teacher"]),
  updateClass
);

// DELETE /api/classes/:id -> Delete a class
router.delete(
  "/:id",
  protect,
  checkRole(["admin", "teacher"]),
  deleteClass
);

// POST /api/classes/:id/students -> Add a student to a class
router.post(
  "/:id/students",
  protect,
  checkRole(["admin", "teacher"]),
  addStudentToClass
);

// DELETE /api/classes/:id/students/:studentId -> Remove a student from a class
router.delete(
  "/:id/students/:studentId",
  protect,
  checkRole(["admin", "teacher"]),
  removeStudentFromClass
);

// PUT /api/classes/:id/teacher -> Assign/change a teacher for a class (ADMIN ONLY)
router.put(
    "/:id/teacher",
    protect,
    checkRole(["admin"]),
    assignTeacherToClass
);


module.exports = router;