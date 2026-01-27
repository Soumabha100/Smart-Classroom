const mongoose = require("mongoose");

// 1. Define the Session Schema (Sub-document)
const sessionSchema = new mongoose.Schema({
  device: { type: String, default: "Unknown Device" },
  ip: { type: String, default: "Unknown IP" },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

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
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    phone: {
      type: String,
      default: "", // Default to an empty string
    },
    bio: {
      type: String,
      default: "", // Default to an empty string
    },
    profilePicture: {
      type: String,
      default: "", // Default to an empty string
    },
    profile: {
      academicInterests: [String],
      careerGoals: [String],
      strengths: [String],
      weaknesses: [String],
      // ✨ ADD a theme preference field
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
    // --- 🆕 NEW CODE START: Database-level AI Dashboard Caching ---
    dashboardCache: {
      type: Map,
      of: new mongoose.Schema(
        {
          data: Object, // Stores the JSON widgets
          lastUpdated: Date, // Stores when it was generated
        },
        { _id: false }
      ),
      default: {},
    },
    // --- 🆕 NEW CODE END ---
    // --- 🔐 LOGIN HISTORY TRACKING ---
    loginHistory: [
      {
        ip: String,
        device: String, // Stores User-Agent (Browser/OS info)
        loginAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    sessions: [sessionSchema],
    // --- END LOGIN HISTORY ---
    // --- 🔑 PASSWORD RESET FIELDS ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // --- END PASSWORD RESET ---
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      default: null,
    },
    chatHistory: { type: mongoose.Schema.Types.ObjectId, ref: "ChatHistory" },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("User", UserSchema);
