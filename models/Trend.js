const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  tech: String,
  source: String,
  stars: Number,
  url: String,
  language: String,
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trend', trendSchema);
