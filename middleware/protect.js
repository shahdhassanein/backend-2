// middleware/protect.js

const jwt = require('jsonwebtoken');
const User = require('../models/usersschema'); // adjust path as needed

const protect = async (req, res, next) => {
  let token;

  // 1. Get token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If no token, respond with error
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user from decoded token
    const user = await User.findById(decoded.id).select('-password');

    // 5. If user not found, token is stale or user deleted
    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    // 6. Attach user to request
    req.user = user;

    next(); // Proceed
  } catch (error) {
    console.error('Token verification error:', error);
    res.clearCookie('token');
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};

module.exports = protect;
