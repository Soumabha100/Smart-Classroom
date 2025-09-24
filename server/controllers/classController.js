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
    const { name, subject, teacher } = req.body;

    let assignedTeacherId;

    if (req.user.role === "admin" && teacher) {
      assignedTeacherId = teacher;
    } else {
      assignedTeacherId = req.user.id;
    }

    const newClass = new Class({
      name,
      subject,
      teacher: assignedTeacherId,
    });

    const savedClass = await newClass.save();
    const populatedClass = await Class.findById(savedClass._id).populate(
      "teacher",
      "name email avatar"
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

// @desc    Add a student to a class
// @route   POST /api/classes/:id/students
// @access  Private (Admin, Teacher)
exports.addStudentToClass = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const { studentId } = req.body;

    const course = await Class.findById(classId);
    const student = await User.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ message: "Class or Student not found" });
    }

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
    }

    if (!student.classes.includes(classId)) {
      student.classes.push(classId);
    }

    await course.save();
    await student.save();

    const updatedClass = await Class.findById(classId)
      .populate("students", "name email avatar")
      .populate("teacher", "name email avatar");
    res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Error adding student to class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
exports.updateClass = async (req, res) => {
  try {
    const { name, teacherId } = req.body;
    // ✨ FIX: Changed req.params.classId to req.params.id
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
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
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
exports.deleteClass = async (req, res) => {
  try {
    // ✨ FIX: This was already correct, but confirming it's req.params.id
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get a single class by ID
// @route   GET /api/classes/:id
// @access  Private (Admin, Teacher)
exports.getClassById = async (req, res) => {
  try {
    // ✨ THE MAIN FIX IS HERE: Changed req.params.classId to req.params.id
    const classItem = await Class.findById(req.params.id)
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classItem);
  } catch (err) {
    console.error("Error in getClassById:", err);
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

// @desc    Get all classes for a specific student
// @route   GET /api/classes/student
// @access  Private (Student)
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

// @desc    Remove a student from a class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private (Admin, Teacher)
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { id: classId, studentId } = req.params;

    const course = await Class.findById(classId);
    const student = await User.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ message: "Class or Student not found" });
    }

    course.students = course.students.filter(
      (s) => s.toString() !== studentId.toString()
    );

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

// @desc    Assign or change a teacher for a class
// @route   PUT /api/classes/:id/teacher
// @access  Private (Admin)
exports.assignTeacherToClass = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const { teacherId } = req.body;

    const course = await Class.findById(classId);
    const teacher = await User.findById(teacherId);

    if (!course || !teacher) {
      return res.status(404).json({ message: "Class or Teacher not found" });
    }

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
