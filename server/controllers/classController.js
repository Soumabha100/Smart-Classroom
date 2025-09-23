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
// @access  Private (Admin, Teacher)
exports.createClass = async (req, res) => {
  try {
    const { name, subject, students, teacherId } = req.body; // Admins can optionally provide a teacherId

    let assignedTeacherId;

    // --- NEW ROBUST LOGIC ---
    if (req.user.role === "admin" && teacherId) {
      // If an admin is creating the class and specifies a teacher
      assignedTeacherId = teacherId;
    } else {
      // For teachers creating their own class, or admins creating for themselves
      assignedTeacherId = req.user.id;
    }
    // --- END OF LOGIC ---

    const newClass = new Class({
      name,
      subject,
      students,
      teacher: assignedTeacherId, // Assign the correct teacher ID
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    console.error("Error creating class:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A class with this name already exists." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
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

// @desc    Get all classes for the logged-in teacher
// @route   GET /api/classes/my-classes
// @access  Private (Teacher)
exports.getTeacherClasses = async (req, res) => {
  try {
    // --- THIS IS THE ONLY CHANGE ---
    // Removed .select("name") and added .populate() to include student/teacher details
    const classes = await Class.find({ teacher: req.user.id })
      .populate("students")
      .populate("teacher");

    if (!classes) {
      return res
        .status(404)
        .json({ message: "No classes found for this teacher." });
    }
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
