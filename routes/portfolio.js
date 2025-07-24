const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/portfolio/idea
router.post('/idea', async (req, res) => {
  const topic = req.body?.topic || 'software development';
  const prompt = `Suggest a creative and unique portfolio project idea in ${topic}. Include:
- Project Title
- Target skills or tech stack
- Real-world use case
- 2–3 stretch features to impress recruiters
Respond in clean Markdown.`;

  try {
    const ai = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'CareerGPT Portfolio'
        }
      }
    );

    const idea = ai.data.choices?.[0]?.message?.content;
    res.json({ idea });
  } catch (err) {
    console.error('❌ Portfolio idea error:', err.message);
    res.status(500).json({ msg: 'Failed to generate idea.' });
  }
});

module.exports = router;
