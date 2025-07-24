const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: String,
  answer: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', ChatSchema);
