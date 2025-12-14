const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId, // FIX: Changed from String to ObjectId
      ref: "Class", // FIX: Added a reference to the 'Class' model
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },
  },
  {
    timestamps: true,
  }
);

// --- 🆕 NEW CODE START: Database Indexes for Performance ---
// Index on studentId: Speeds up queries like "Get all attendance records for a student"
AttendanceSchema.index({ studentId: 1 });

// Compound index on classId and timestamp: Speeds up "Get attendance for a class, sorted by date"
AttendanceSchema.index({ classId: 1, timestamp: -1 });
// --- 🆕 NEW CODE END ---

module.exports = mongoose.model("Attendance", AttendanceSchema);
