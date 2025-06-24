const mongoose = require('mongoose');

// Update schema for subscriptions
const SubscriptionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (username) {
                return /^[a-zA-Z0-9\s]+$/.test(username);
            },
            message: 'Invalid username format.',
        },
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Invalid email format.',
        },
    },
    type: {
        type: String,
        enum: ['Newsletter', 'Updates'],
        required: true,
    },
    niches: {
        type: [String], // Array of strings to store selected categories
        validate: {
            validator: function (niches) {
                const allowedCategories = [
                    "Technology", "Sports", "Entertainment", "Science", "Health",
                    "Lifestyle", "Education", "Romance", "Politics", "Business",
                    "Travel", "Fashion"
                ];
                return niches.every((niche) => allowedCategories.includes(niche));
            },
            message: 'Invalid category selection.',
        },
    },
    engagement: {
        lastOpened: { type: Date },
        openRate: { type: Number, default: 0 }, 
        clickRate: { type: Number, default: 0 },
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    isUnsubscribed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
