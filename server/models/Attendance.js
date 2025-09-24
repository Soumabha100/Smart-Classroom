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

module.exports = mongoose.model("Attendance", AttendanceSchema);
