const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const options = {
    discriminatorKey: 'type'
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    post: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    password: {
        type: String,
        required: true
    },
    type: { type: String, enum: ['Admin', 'Reader', 'Subscriber', 'Editor'] },
    avatar: { type: String, default: 'default-avatar-url.png' },
    refreshToken: String,
    isBlocked: {
        type: Boolean,
        default: false
    },
    lastLogin: { 
        type: Date, 
        default: null 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isOptedInForPromotions: {
        type: Boolean,
        default: false, 
    },
    bio: { 
        type: String, 
        default: '' 
    },
    education: { 
        type: String, 
        default: '' 
    },
    workExperience: { 
        type: String, 
        default: '' 
    },
    specialty: { 
        type: String, 
        default: '' 
    },
    awards: { 
        type: String, 
        default: '' 
    },
    socialMediaHandles: {
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' }
    },
      otp: String,
    otpExpires: Date,
}, { timestamps: true, ...options })


userSchema.methods.setOtp = function () {
    this.otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    this.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
};

// Method to clear OTP after it has been used
userSchema.methods.clearOtp = function () {
    this.otp = undefined;
    this.otpExpires = undefined;
};

module.exports = mongoose.model('User', userSchema)