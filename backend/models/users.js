const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return `AMLAD${crypto.randomInt(100, 999)}STF${crypto.randomInt(1000, 9999)}`;
    }
  },
  role: {
    type: String,
    enum: ['Director','Admin', 'Lab Scientist', 'Pharmacist', 'Nurse', 'Receptionist'],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
    trim: true,
  },
  nationality: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  imageUrl: { type: String, default: 'default-profile.png' },
  loginHistory: [
    {
        timestamp: { type: Date, default: Date.now },
        ipAddress: { type: String }
    }
  ],
  isBlocked: { type: Boolean, default: false },
  refreshToken: { type: String },
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Hash password before saving
staffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
staffSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT Token
staffSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = mongoose.model('Staffs', staffSchema); 
