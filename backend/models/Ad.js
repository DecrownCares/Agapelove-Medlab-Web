const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },
    placeholders: [{ type: Number, required: true }],
    description: { type: String, default: "Discover what we have to offer!" }, // Optional description
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Ad', AdSchema);
