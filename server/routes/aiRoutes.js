const express = require("express");
const router = express.Router();
const {
  generateDashboard,
  ask,
  getChatHistories,
  getChatHistoryByChatId,
  deleteChatHistory,
} = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");
const  checkRole  = require("../middlewares/checkRole");

// Route for your AI dashboard (unchanged)
router.post(
  "/generate-dashboard",
  protect,
  checkRole(["student"]),
  generateDashboard
);

// --- NEW, CORRECT ROUTES FOR MULTI-CHAT SYSTEM ---

// Handles a message for a specific chat session
router.post("/ask", protect, ask);

// Gets all chat history summaries for the user
router.get("/history", protect, getChatHistories);

// Gets the full history for a specific chat
router.get("/history/:chatId", protect, getChatHistoryByChatId);

// Deletes a specific chat history
router.delete("/history/:chatId", protect, deleteChatHistory);

module.exports = router;
