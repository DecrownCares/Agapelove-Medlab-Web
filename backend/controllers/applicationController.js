const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

// Multer setup for file upload
const upload = multer({ dest: "uploads/resumes/" });

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "Gmail", // Change this if using another provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Handle job application submission
const applyForJob = async (req, res) => {
    try {
        const { role, name, email, message } = req.body;

        if (!role || !name || !email || !req.file) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const resumePath = req.file.path;
        console.log("HR_EMAIL from .env:", process.env.HR_EMAIL);
        // Email details
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.HR_EMAIL,
            subject: `New Job Application for ${role}`,
            html: `
                <h3>New Job Application Received</h3>
                <p><strong>Role:</strong> ${role}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
            attachments: [
                {
                    filename: req.file.originalname,
                    path: resumePath,
                },
            ],
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Delete resume after sending
        fs.unlinkSync(resumePath);

        res.status(200).json({ message: "Application submitted successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Failed to send application email!" });
    }
};

module.exports = { upload, applyForJob };
