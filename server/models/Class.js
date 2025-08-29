const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This will link to a User with the 'teacher' role
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // An array of students enrolled in the class
  }],
  // You can add more fields like 'subject', 'schedule', etc. later
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);