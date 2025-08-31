const router = require("express").Router();
const {
  registerParent,
  getParents,
  getStudentsForParent,
} = require("../controllers/parentController");
const { login: parentLogin } = require("../controllers/parentAuthController"); // Import login
const { verifyToken } = require("../middlewares/authMiddleware");

// Middleware for role checks
const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Access denied. Admins only." });
};

const checkParentRole = (req, res, next) => {
  if (req.user && req.user.role === "parent") next();
  else res.status(403).json({ message: "Access denied. Parents only." });
};

// --- Routes --- // 
router.post("/register", verifyToken, checkAdminRole, registerParent); // Admin route
router.get("/", verifyToken, checkAdminRole, getParents); // Admin route
router.get("/my-students", verifyToken, checkParentRole, getStudentsForParent); // Parent route

module.exports = router;
