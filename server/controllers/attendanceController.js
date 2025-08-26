const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');

// Teacher generates a token for the QR code
exports.generateQrToken = (req, res) => {
  const payload = {
    classId: req.body.classId, // e.g., "CSE-501"
    timestamp: Date.now(),
  };
  // This token is short-lived (e.g., 30 seconds)
  const qrToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30s' });
  res.json({ qrToken });
};

// Student marks their attendance
exports.markAttendance = async (req, res) => {
  const { qrToken } = req.body;
  try {
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);

    // Check if already marked for this class recently (optional)

    const newAttendance = new Attendance({
      studentId: req.user.id,
      classId: decoded.classId,
    });
    await newAttendance.save();
    res.status(201).json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    // This will catch expired or invalid tokens
    res.status(400).json({ message: 'Invalid or expired QR code.' });
  }
};