const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        link: {  
            type: String,
            required: true,
        },
        senderName: {
            type: String,
            required: true,
            trim: true,
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        recipients: {
            type: [String], // Array of recipient emails
            default: [],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Index for optimized querying (e.g., by title or senderName)
PromotionSchema.index({ title: 'text', senderName: 'text' });

const Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;
