const express = require("express");
const router = express.Router();
const HODFeed = require("../models/HODFeed");

// GET all announcements, latest first
router.get("/", async (req, res) => {
  try {
    const feedItems = await HODFeed.find().sort({ createdAt: -1 });
    res.json(feedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new announcement
router.post("/", async (req, res) => {
  try {
    const { text, createdBy } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    const newItem = new HODFeed({ text, createdBy: createdBy || "Teacher" });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE announcement by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await HODFeed.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Announcement not found" });
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
