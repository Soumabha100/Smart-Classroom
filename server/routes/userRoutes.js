const router = require("express").Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserCount, // 1. Import the new controller function
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// This route is now protected.
router.get("/profile", verifyToken, getUserProfile);
router.post("/profile", verifyToken, updateUserProfile);

// 2. Add the new route for getting user counts
router.get("/count", verifyToken, getUserCount);

module.exports = router;