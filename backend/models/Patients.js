const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const options = {
    discriminatorKey: 'type'
};

const patientSchema = new Schema({
    labPatientId: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            return `AMLADPTID${crypto.randomInt(100, 99999)}UQ`;
        }
    },
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    role: {
        type: String,
        enum: ['Patient', 'Other'],
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    address: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        default: 'img/ImageUnavailable.jpeg'
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        default: 'Unknown'
    },
    underlyingConditions: {
        type: [String], // List of conditions (e.g., diabetes, hypertension)
        default: []
    },
    allergies: {
        type: [String], // List of allergies
        default: []
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    registeredBy: {
        type: String,
        required: false
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    lastLogin: [
        {
            timestamp: { type: Date, default: Date.now },
            ipAddress: { type: String }
        }
      ],
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    testResults: [{
        type: Schema.Types.ObjectId,
        ref: 'TestResult'   // Stores test results references
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    medicalRecords: [{
        type: Schema.Types.ObjectId,
        ref: 'Sample'  // Stores medical test references
    }],
    refreshToken: { type: String },
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Hash password before saving
patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Patients', patientSchema);



// userSchema.methods.setOtp = function () {
//     this.otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
//     this.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
// };

// // Method to clear OTP after it has been used
// userSchema.methods.clearOtp = function () {
//     this.otp = undefined;
//     this.otpExpires = undefined;
// };