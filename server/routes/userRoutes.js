const router = require("express").Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserCount,
  getTeachers,
  getStudents
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// This route is now protected.
router.get("/profile", verifyToken, getUserProfile);
router.post("/profile", verifyToken, updateUserProfile);

// 2. Add the new route for getting user counts
router.get("/count", verifyToken, getUserCount);

router.get("/teachers", verifyToken, getTeachers);
router.get('/students', verifyToken, getStudents);

module.exports = router;