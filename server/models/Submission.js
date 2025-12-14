const mongoose = require("mongoose");
const SubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String }, // Link to uploaded file
    textSubmission: { type: String },
    submittedAt: { type: Date, default: Date.now },
    marks: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true }
);

// --- 🆕 NEW CODE START: Database Indexes for Performance ---
// Compound index on studentId and assignmentId: Speeds up checking student submissions
// This prevents duplicate submissions (one student should only submit once per assignment)
SubmissionSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

// Index on assignmentId: Speeds up "Get all submissions for an assignment" (teacher grading view)
SubmissionSchema.index({ assignmentId: 1 });
// --- 🆕 NEW CODE END ---

module.exports = mongoose.model("Submission", SubmissionSchema);
