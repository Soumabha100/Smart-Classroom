const router = require("express").Router();
const {
  getClasses,
  createClass,
  addStudentToClass,
  updateClass,
  deleteClass,
  getClassById,
} = require("../controllers/classController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/checkRole"); // Assuming you'll adapt this for 'admin'

// Middleware to check for Admin role (you can create a specific one)
const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

router.get("/", verifyToken, getClasses);
router.post("/", verifyToken, checkAdminRole, createClass);

router.post(
  "/:classId/students",
  verifyToken,
  checkAdminRole,
  addStudentToClass
);

router.put("/:classId", verifyToken, checkAdminRole, updateClass);
router.delete("/:classId", verifyToken, checkAdminRole, deleteClass);
router.get('/:classId', verifyToken, getClassById);

module.exports = router;
