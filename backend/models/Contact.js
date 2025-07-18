const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
    isReplied: {type: Boolean, default: false},
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
