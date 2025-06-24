// models/message.js
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    file: { type: String },
    read: { type: Boolean, default: false }, // Add 'read' field
    createdAt: { type: Date, default: Date.now }
}); 


// Encrypt message content before saving
messageSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        this.content = CryptoJS.AES.encrypt(this.content, process.env.ENCRYPTION_KEY).toString();
    }
    next();
});

// Decrypt message content when fetching
messageSchema.methods.decryptContent = function () {
    const bytes = CryptoJS.AES.decrypt(this.content, process.env.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model('Message', messageSchema);
