const express = require('express');
const router = express.Router();
const Trend = require('../models/Trend');

// GET /api/trends/github
router.get('/github', async (req, res) => {
  try {
    const trends = await Trend.find({ source: 'GitHub' }).sort({ stars: -1 }).limit(15);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

module.exports = router;
