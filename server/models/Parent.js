// Example Parent.js model
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sessionSchema = new mongoose.Schema({
  device: { type: String, default: "Unknown Device" },
  ip: { type: String, default: "Unknown IP" },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const ParentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: "parent" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    sessions: [sessionSchema],
  },
  { timestamps: true },
);

ParentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Parent", ParentSchema);
