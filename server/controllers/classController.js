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
  try {
    const { classId } = req.params;
    const { studentId } = req.body;

    // Find both the class and the student
    const course = await Class.findById(classId);
    const student = await User.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ message: "Class or Student not found" });
    }
    
    // Add student to class's student list (if not already there)
    if (!course.students.includes(studentId)) {
        course.students.push(studentId);
        await course.save();
    }

    // Add class to student's class list (if not already there)
    if (!student.classes.includes(classId)) {
        student.classes.push(classId);
        await student.save();
    }

    res.status(200).json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Error adding student to class:", error);
    res.status(500).json({ message: "Server error" });
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

// Get all classes for a specific student
exports.getStudentClasses = async (req, res) => {
  try {
    // Find the student by their ID from the authenticated user token
    const student = await User.findById(req.user.id).populate({
      path: 'classes',
      // Further populate the teacher details within each class
      populate: {
        path: 'teacher',
        select: 'name email'
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Respond with the populated list of classes from the student's document
    res.json(student.classes);
  } catch (error) {
    console.error("Error fetching student classes:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};