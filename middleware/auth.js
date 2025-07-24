const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    console.log('🔐 Authenticated user ID:', decoded.id);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(400).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
