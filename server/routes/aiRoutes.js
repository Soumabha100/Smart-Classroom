const express = require("express");
const router = express.Router();
const {
  generateDashboard,
  chatWithAI,
  getChatHistory,
} = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/checkRole");

// @route   POST /api/ai/generate-dashboard
// @desc    Generate personalized dashboard content for a student
// @access  Private (Students only)
router.post(
  "/generate-dashboard",
  protect,
  checkRole(["student"]),
  generateDashboard
);

// Use protect (a middleware function), not the module object
router.post("/chat", protect, chatWithAI);
router.get("/chat/history", protect, getChatHistory);

module.exports = router;
