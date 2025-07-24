const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String, 
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});
module.exports = mongoose.model('User', UserSchema);
