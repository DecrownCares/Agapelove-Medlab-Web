// const Staffs = require('../models/users');
const Patients = require('../models/Patients');
// const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const emailService = require('../services/emailService');


dotenv.config();


const login = async (req, res) => {
    console.log("🔹 patientLogin function called.");
    try {
        const { email, identifier, password } = req.body; 

        console.log("Request Body:", req.body);

        // Use email if identifier is not provided
        const userIdentifier = identifier || email;  

        console.log("Request Body:", req.body);

        if (!userIdentifier || !password) {
            return res.status(400).json({ message: "Email/Phone and password are required." });
        }

        // Check if user exists (either by email or phone)
        const foundUser = await Patients.findOne({
            $or: [{ email: userIdentifier.trim() }, { phone: userIdentifier.trim() }]
        }).select("+password"); // Explicitly fetch password

        if (!foundUser) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Compare password
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT Access Token
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    _id: foundUser._id,
                    fullName: foundUser.fullName,
                    email: foundUser.email,
                    role: foundUser.role
                }
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: "1d" }
        );

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            { _id: foundUser._id },
            process.env.REFRESH_TOKEN,
            { expiresIn: "7d" }
        );

        // Save refresh token in database
        foundUser.refreshToken = refreshToken;

        // Record login history (IP address and timestamp)
        const loginRecord = {
            timestamp: new Date(),
            ipAddress: req.ip || req.connection.remoteAddress
        };

        // Ensure lastLogin exists and keep only the last 10 records
        foundUser.lastLogin = foundUser.lastLogin || [];
        foundUser.lastLogin.unshift(loginRecord); // Add new login at the beginning
        foundUser.lastLogin = foundUser.lastLogin.slice(0, 10); // Keep only the last 10 logins

        await foundUser.save();

        // Send tokens as HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'Lax',
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
        });

        // Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Respond with Access Token & User Info
        res.status(200).json({
            accessToken,
            user: {
                _id: foundUser._id,
                fullName: foundUser.fullName,
                email: foundUser.email,
                role: foundUser.role,
                patientId: foundUser.labPatientId
            }
            
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const sendResetLink = async (req, res) => {
    try {
        console.log("🔹 sendResetLink function called.");
        console.log("Request body:", req.body);

        let { email } = req.body;
        const user = await Patients.findOne({ email });

        if (!user) {
            console.log("❌ User not found.");
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("✅ User found:", user.email);

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        console.log("Generated reset token:", resetToken);

        const hashedToken = await bcrypt.hash(resetToken, 10);
        console.log("Hashed reset token:", hashedToken);

        // Update user in database
        const updatedUser = await Patients.findOneAndUpdate(
            { email: user.email }, 
            { 
                $set: {  // ✅ Use `$set` to ensure proper update
                    resetPasswordToken: hashedToken, 
                    resetPasswordExpires: Date.now() + 3600000 // Expires in 1 hour
                }
            },
            { new: true } // ✅ Ensure it returns the updated document
        );

        console.log("✅ Updated user:", updatedUser);

        if (!updatedUser) {
            console.log("❌ Failed to update user in database.");
            return res.status(500).json({ message: 'Failed to update reset token' });
        }

        // Construct reset link
        const resetLink = `https://agapelove-medlab-ms.onrender.com/new-password?token=${resetToken}&email=${email}`;
        console.log("Reset link:", resetLink);

        // Send email
        await emailService.sendResetEmail(email, resetLink);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending reset link:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




/**
 * Reset password with token verification
 */
const staffResetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await Patients.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resetPasswordToken) {
            return res.status(400).json({ message: "No reset token found. Request a new password reset." });
        }


        // Verify token
        const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isTokenValid) {
            return res.status(400).json({ message: "Invalid reset token." });
        }

        if (Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ message: "Reset token has expired. Request a new one." });
        }

        // 🔥 Hash new password before saving
        user.password = newPassword;
        user.resetPasswordToken = null;  
        user.resetPasswordExpires = null;  
        await user.save();

        console.log("Password reset successfully for:", email);

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    login,
    sendResetLink,
    staffResetPassword
};
  
  
