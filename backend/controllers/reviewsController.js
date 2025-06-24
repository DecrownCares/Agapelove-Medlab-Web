const Review = require("../models/Reviews");
const path = require("path");
const fs = require("fs");

// ✅ Handle Review Submission
const submitReview = async (req, res) => {
    try {
        const { name, email, review } = req.body;
        let imagePath = "";

        // Check if an image was uploaded
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Create and save the review
        const newReview = new Review({ name, email, review, image: imagePath });
        await newReview.save();

        res.status(201).json({ success: true, message: "Review submitted successfully!", imageURL: imagePath });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ success: false, message: "Error submitting review" });
    }
};

// ✅ Get All Reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).limit(10); // Fetch latest 10 reviews
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
};

module.exports = {
    submitReview,
    getReviews,
}
