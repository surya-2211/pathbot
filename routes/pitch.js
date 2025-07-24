const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate', async (req, res) => {
  const { name, role, skills, goal, format = 'elevator' } = req.body;

  const formats = {
    elevator: 'Generate a confident 60-second elevator pitch.',
    resume: 'Write a professional resume summary (2–3 sentences).',
    linkedin: 'Create a friendly and authentic LinkedIn “About Me” paragraph.',
    portfolio: 'Write a short intro blurb for a developer portfolio README.'
  };

  const instruction = formats[format] || formats.elevator;
  const prompt = `${instruction}

Details:
- Name: ${name}
- Role: ${role}
- Skills: ${skills}
- Goal: ${goal}

Keep it in first person, natural tone, under 100 words.`

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'CareerGPT Elevator Pitch'
        }
      }
    );

    const pitch = response.data.choices?.[0]?.message?.content || '';
    res.json({ pitch });
  } catch (err) {
    console.error('❌ Pitch generation error:', err.message);
    res.status(500).json({ msg: 'Failed to generate pitch.' });
  }
});

module.exports = router;
