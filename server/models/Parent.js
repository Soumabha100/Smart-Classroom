// Example Parent.js model
const mongoose = require("mongoose");
const ParentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: "parent" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Parent", ParentSchema);
