const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Generate token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// Protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      res.status(401).json({ message: 'Not authorised, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorised, no token' });
  }
};

// Admin only
const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  res.status(403).json({ message: 'Admin access required' });
};

module.exports = { generateToken, protect, admin };
