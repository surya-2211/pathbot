const express = require('express');
const router = express.Router();
const axios = require('axios');
const PDFDocument = require('pdfkit');
const stream = require('stream');

router.post('/', async (req, res) => {
  const { goal } = req.body;

  if (!goal) {
    return res.status(400).json({ msg: 'Please provide a goal.' });
  }

  const prompt = `Generate a Markdown-formatted career roadmap for becoming a ${goal}. Include key skills, tools, and milestones.`

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
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'CareerGPT Roadmap'
        }
      }
    );

    const roadmap = response.data.choices?.[0]?.message?.content || 'No response.';
    res.json({ roadmap });
  } catch (err) {
    console.error('❌ Roadmap generation error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to generate roadmap.' });
  }
});

router.post('/pdf', async (req, res) => {
  const { roadmap, title = 'Career Roadmap' } = req.body;
  if (!roadmap) return res.status(400).json({ msg: 'No roadmap content provided.' });

  const doc = new PDFDocument();
  const bufferStream = new stream.PassThrough();

  res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');

  doc.pipe(bufferStream);
  doc.font('Times-Roman').fontSize(14).text(roadmap, { lineGap: 6 });
  doc.end();

  bufferStream.pipe(res);
});

module.exports = router;
