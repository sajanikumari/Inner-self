const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called for:', req.method, req.url);
    const authHeader = req.header('Authorization');
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');

    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    console.log('🔍 Token preview:', token.substring(0, 20) + '...');
    console.log('🔐 Using JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing (using fallback)');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token decoded successfully, userId:', decoded.userId);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('❌ User not found for userId:', decoded.userId);
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    console.log('✅ User authenticated:', user.email);
    req.user = user;
    req.userId = user._id; // Add userId for consistency with routes
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.name, error.message);
    if (error.name === 'JsonWebTokenError') {
      console.error('❌ JWT Error - possibly wrong secret or malformed token');
    } else if (error.name === 'TokenExpiredError') {
      console.error('❌ Token expired');
    }
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = auth;