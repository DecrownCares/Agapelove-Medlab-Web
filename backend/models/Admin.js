const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const AdminSchema = User.discriminator('Admin', new Schema({
    username: {
        type: String
    }
}));

module.exports = AdminSchema;