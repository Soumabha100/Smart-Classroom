const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"], // Role must be one of these values
      default: "student", // If no role is provided, it defaults to 'student'
    },
    profile: {
      academicInterests: [String],
      careerGoals: [String],
      strengths: [String],
      weaknesses: [String],
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },
    timetable: {
      // To be implemented later
      type: Object,
    },
    // In server/models/User.js, inside the UserSchema
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      default: null,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("User", UserSchema);
