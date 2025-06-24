const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    review: { type: String, required: true },
    reviewType: { type: String, enum: ["Praise", "Suggestion", "Concern", "Other"], required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    image: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
