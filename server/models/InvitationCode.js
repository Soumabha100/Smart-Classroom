const mongoose = require('mongoose');

const InvitationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['teacher'], // For now, only teachers can be invited
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('InvitationCode', InvitationCodeSchema);