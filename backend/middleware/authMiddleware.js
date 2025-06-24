const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Authentication error:", err); // Log the error for debugging
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = {
  authMiddleware,
};
