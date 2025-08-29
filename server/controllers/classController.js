const Class = require("../models/Class");
const User = require("../models/User");

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin, Teacher)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacher", "name")
      .populate("students", "name");
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Admin)
exports.createClass = async (req, res) => {
  const { name, teacherId } = req.body;
  try {
    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    let newClass = new Class({ name, teacher: teacherId });
    await newClass.save();

    // FIX: Populate teacher details before sending the response
    newClass = await newClass.populate("teacher", "name");

    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Adds Students to class
exports.addStudentToClass = async (req, res) => {
  const { classId } = req.params;
  const { studentId } = req.body;

  try {
    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Find the class and add the student's ID to its 'students' array
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } }, // $addToSet prevents duplicate entries
      { new: true } // This option returns the updated document
    ).populate("students", "name");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:classId
// @access  Private (Admin)
exports.updateClass = async (req, res) => {
  try {
    const { name, teacherId } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.classId,
      { name, teacher: teacherId },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:classId
// @access  Private (Admin)
exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.classId);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.classId)
      .populate("teacher", "name")
      .populate("students", "name");
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classItem);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
