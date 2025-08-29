const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin, Teacher)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher', 'name').populate('students', 'name');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Admin)
exports.createClass = async (req, res) => {
  const { name, teacherId } = req.body;
  try {
    // Check if the teacher exists and has the 'teacher' role
    const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found or user is not a teacher.' });
    }

    const newClass = new Class({
      name,
      teacher: teacherId,
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};