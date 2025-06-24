const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User')
const readersSchema = User.discriminator('Reader', new Schema({
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
    password: {
        type: String,
        required: true
    },
}));

module.exports = readersSchema;