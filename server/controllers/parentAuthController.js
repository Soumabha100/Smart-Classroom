const Parent = require("../models/Parent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Authenticate a parent and get token
// @route   POST /api/parents/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email });
    if (!parent) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: parent._id,
      role: parent.role,
      students: parent.students, // Include children IDs in the token
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      role: parent.role,
      name: parent.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};