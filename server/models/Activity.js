const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['video', 'article', 'coding_challenge'], required: true },
  link: { type: String, required: true },
  tags: [String], // e.g., ['AI', 'Beginner', '30-min']
});

module.exports = mongoose.model('Activity', ActivitySchema);