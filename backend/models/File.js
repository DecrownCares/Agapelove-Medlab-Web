const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
    description: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", FileSchema);
