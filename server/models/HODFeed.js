const mongoose = require("mongoose");

const hodFeedSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: "Teacher" }, // Optionally store user ID or role
});

module.exports = mongoose.model("HODFeed", hodFeedSchema);
