const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  // A link to the user. This is NOT unique.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // This adds a regular index for fast searching.
  },
  // A unique ID for EACH chat session. THIS is what must be unique.
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  history: [
    {
      role: String,
      parts: [{ text: String }],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
