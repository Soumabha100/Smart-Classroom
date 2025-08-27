const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get recommended activities for a student
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// @desc    Create a new activity (for admin/testing purposes)
// @route   POST /api/activities
// @access  Private (should be restricted to teachers/admins later)
exports.createActivity = async (req, res) => {
    const { title, description, type, link, tags } = req.body;
    try {
        const newActivity = new Activity({
            title,
            description,
            type,
            link,
            tags
        });
        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};