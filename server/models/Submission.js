const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String }, // Link to uploaded file
  textSubmission: { type: String },
  submittedAt: { type: Date, default: Date.now },
  marks: { type: Number },
  feedback: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Submission', SubmissionSchema);