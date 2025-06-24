const express = require("express");
// const multer = require("multer");
// const path = require("path");
const upload = require("../middleware/upload");
const reviewsController = require("../controllers/reviewsController");

const router = express.Router();

// // ✅ Set up Multer for image uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads/"); // Store images in 'public/uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
//     }
// });

// const upload = multer({ storage });

// ✅ Routes
router.post("/submit-review", upload.single("image"), reviewsController.submitReview);
router.get("/get-reviews", reviewsController.getReviews);

module.exports = router;
