const mongoose = require('mongoose');
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  dueDate: { type: Date, required: true },
  totalMarks: { type: Number, default: 100 },
}, { timestamps: true });
module.exports = mongoose.model('Assignment', AssignmentSchema);