const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Token = require('../models/Token');

dotenv.config();

const generateToken = (user, type) => {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = type === 'access' ? '15m' : '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

const registerUser = async (username, email, password) => {
  const user = new User({ username, email, password });
  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateToken(user, 'access');
  const refreshToken = generateToken(user, 'refresh');

  const token = new Token({
    userId: user._id,
    token: refreshToken,
    type: 'refresh',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  await token.save();

  return { accessToken, refreshToken };
};

const refreshUserToken = async (token) => {
  const existingToken = await Token.findOne({ token, type: 'refresh' });
  if (!existingToken) {
    throw new Error('Invalid refresh token');
  }

  const user = await User.findById(existingToken.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const newAccessToken = generateToken(user, 'access');
  const newRefreshToken = generateToken(user, 'refresh');

  existingToken.token = newRefreshToken;
  existingToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await existingToken.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
};
