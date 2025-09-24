const Class = require("../models/Class");
const User = require("../models/User");

// @desc    Get all classes for the logged-in user (student or teacher)
// @route   GET /api/classes
// @access  Private
exports.getClasses = async (req, res) => {
  try {
    let classes;
    // For teachers, find classes they are assigned to
    if (req.user.role === "teacher") {
      classes = await Class.find({ teacher: req.user.id })
        .populate("teacher", "name")
        .populate("students", "name");
      // For students, find classes they are enrolled in
    } else if (req.user.role === "student") {
      const student = await User.findById(req.user.id).populate({
        path: "classes",
        populate: { path: "teacher", select: "name email" },
      });
      classes = student.classes;
    } else {
      // Fallback for any other roles or issues
      classes = [];
    }
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✨ NEW FUNCTION FOR ADMINS (Does not affect any other function)
// @desc    Get ALL classes in the system
// @route   GET /api/classes/all
// @access  Private (Admin)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({})
      .populate("teacher", "name email")
      .populate("students", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Admin, Teacher)
exports.createClass = async (req, res) => {
  try {
    const { name, subject, students, teacherId } = req.body;

    let assignedTeacherId;

    if (req.user.role === "admin" && teacherId) {
      assignedTeacherId = teacherId;
    } else {
      assignedTeacherId = req.user.id;
    }

    const newClass = new Class({
      name,
      subject,
      students,
      teacher: assignedTeacherId,
    });

    const savedClass = await newClass.save();
    // Populate teacher details in the response for immediate use on the frontend
    const populatedClass = await Class.findById(savedClass._id).populate(
      "teacher",
      "name email"
    );
    res.status(201).json(populatedClass);
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
    // ✨ FIX: Changed req.params.classId to req.params.id to match the route definition
    const { id: classId } = req.params; 
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
    }

    // Add class to student's class list (if not already there)
    if (!student.classes.includes(classId)) {
        student.classes.push(classId);
    }
    
    await course.save();
    await student.save();

    // Return the updated class with populated students for a seamless UI update
    const updatedClass = await Class.findById(classId).populate('students', 'name email avatar').populate('teacher', 'name email avatar');
    res.status(200).json(updatedClass);

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
    ).populate("teacher", "name email");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:classId
// @access  Private (Admin)
exports.deleteClass = async (req, res) => {
  try {
    // FIX: Changed req.params.classId to req.params.id to match the route
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all classes for the logged-in teacher
// @route   GET /api/classes/my-classes
// @access  Private (Teacher)
exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id })
      .populate("students", "name email")
      .populate("teacher", "name email");

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
    const student = await User.findById(req.user.id).populate({
      path: "classes",
      populate: {
        path: "teacher",
        select: "name email",
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student.classes);
  } catch (error) {
    console.error("Error fetching student classes:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.removeStudentFromClass = async (req, res) => {
  try {
    const { id: classId, studentId } = req.params;

    const course = await Class.findById(classId);
    const student = await User.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ message: "Class or Student not found" });
    }

    // Remove student from class.students
    course.students = course.students.filter(
      (s) => s.toString() !== studentId.toString()
    );

    // Remove class from student.classes
    student.classes = student.classes.filter(
      (c) => c.toString() !== classId.toString()
    );

    await course.save();
    await student.save();

    const updatedClass = await Class.findById(classId)
      .populate("students", "name email")
      .populate("teacher", "name email");

    res.status(200).json(updatedClass);
  } catch (err) {
    console.error("Error removing student from class:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Assign or change a teacher for a class (admin only)
// PUT /api/classes/:id/teacher
exports.assignTeacherToClass = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const { teacherId } = req.body;

    const course = await Class.findById(classId);
    const teacher = await User.findById(teacherId);

    if (!course || !teacher) {
      return res.status(404).json({ message: "Class or Teacher not found" });
    }

    // Optional: validate that the user you pass is actually a teacher
    if (teacher.role && teacher.role !== "teacher") {
      return res
        .status(400)
        .json({ message: "Provided user is not a teacher" });
    }

    course.teacher = teacherId;
    await course.save();

    const updatedClass = await Class.findById(classId)
      .populate("teacher", "name email")
      .populate("students", "name email");

    res.status(200).json(updatedClass);
  } catch (err) {
    console.error("Error assigning teacher to class:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};