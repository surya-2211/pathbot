const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');

router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  const convo = await Conversation.create({ user: req.user, title: title || 'New Conversation', messages: [] });
  res.json(convo);
});

router.post('/:id/message', auth, async (req, res) => {
  const { role, content } = req.body;
  const convo = await Conversation.findById(req.params.id);

  convo.messages.push({ role, content });

  if (!convo.title || convo.title === 'New Conversation') {
    const firstUserMsg = convo.messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      convo.title = firstUserMsg.content.slice(0, 40);
    }
  }

  await convo.save();
  res.json(convo);
});

router.patch('/:id', auth, async (req, res) => {
  const convo = await Conversation.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  );
  res.json(convo);
});

router.delete('/:id', auth, async (req, res) => {
  await Conversation.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Conversation deleted' });
});

router.get('/', auth, async (req, res) => {
  const convos = await Conversation.find({ user: req.user }).sort({ createdAt: -1 });
  res.json(convos);
});

router.get('/:id', auth, async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  res.json(convo);
});

module.exports = router;
