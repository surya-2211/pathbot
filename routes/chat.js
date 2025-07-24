const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const axios = require('axios');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 3) {
    return res.status(400).json({ msg: 'Please enter a career-related question.' });
  }

  exec(`python ../vector/query_index.py "${message}"`, async (err, stdout) => {
    if (err) {
      console.error('❌ Retrieval error:', err.message);
      return res.status(500).json({ msg: 'RAG retrieval failed.' });
    }

    let chunks;
    try {
      chunks = JSON.parse(stdout);
    } catch (e) {
      return res.status(500).json({ msg: 'Invalid RAG format' });
    }

    const promptMessages = [
      {
        role: 'system',
        content:
          'You are pathbot, a helpful AI career mentor. Use only Markdown formatting. Do not echo the prompt or context.'
      },
      {
        role: 'user',
        content: `Context:\n${chunks.join('\n\n')}\n\n---\n\nUser: ${message}`
      }
    ];

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: promptMessages
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'CareerGPT'
          }
        }
      );

      const reply = response.data.choices?.[0]?.message?.content?.trim() || 'I’m here to help!';
      const newChat = new Chat({ user: req.user, question: message, answer: reply });
      await newChat.save();
      await User.findByIdAndUpdate(req.user, { $push: { chats: newChat._id } });

      res.json({ response: reply });
    } catch (err) {
  const isRateLimited = err.response?.status === 429;
  const fallbackMsg = isRateLimited
    ? 'CareerGPT is taking a quick break due to high demand. Please try again in a few moments!'
    : 'AI assistant is currently unavailable.';

  console.error('❌ OpenRouter error:', err.response?.data || err.message);
  res.status(500).json({ msg: fallbackMsg });
}

  });
});

router.get('/history', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user }).sort({ timestamp: -1 });
    res.json({ chats });
  } catch (err) {
    console.error('❌ Failed to fetch chat history:', err.message);
    res.status(500).json({ msg: 'Could not retrieve chat history' });
  }
});

module.exports = router;
