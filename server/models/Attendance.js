const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: String, required: true }, // Or a ref to a 'Class' model later
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);