const Parent = require("../models/Parent");
const User = require("../models/User");
const Attendance = require('../models/Attendance');

// @desc    Register a new parent
// @route   POST /api/parents/register
// @access  Private (Admin)
exports.registerParent = async (req, res) => {
  const { name, email, password, studentIds } = req.body;
  try {
    const parentExists = await Parent.findOne({ email });
    if (parentExists) {
      return res
        .status(400)
        .json({ message: "Parent with this email already exists." });
    }

    const newParent = new Parent({
      name,
      email,
      password,
      students: studentIds,
    });
    const savedParent = await newParent.save();

    // Now, link the students to this new parent
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $set: { parentId: savedParent._id } }
    );

    res.status(201).json(savedParent);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Get all parents
// @route   GET /api/parents
// @access  Private (Admin)
exports.getParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate("students", "name");
    res.status(200).json(parents);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Get students linked to the logged-in parent
// @route   GET /api/parents/my-students
// @access  Private (Parent)
exports.getStudentsForParent = async (req, res) => {
    try {
        // req.user is populated by verifyToken middleware from the parent's JWT
        const studentIds = req.user.students; 

        if (!studentIds || studentIds.length === 0) {
            return res.json([]);
        }

        // Fetch students and their last 10 attendance records
        const students = await User.find({ '_id': { $in: studentIds } }).select('name email');

        const studentData = await Promise.all(students.map(async (student) => {
            const attendance = await Attendance.find({ studentId: student._id })
                .sort({ timestamp: -1 })
                .limit(10); // Get the last 10 records

            return {
                ...student.toObject(),
                attendance,
            };
        }));

        res.json(studentData);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
