const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const EditorSchema = User.discriminator('Editor', new Schema({
    username: {
        type: String
    }
}));

module.exports = EditorSchema;