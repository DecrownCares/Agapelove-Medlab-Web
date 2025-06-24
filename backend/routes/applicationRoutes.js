const express = require('express');
const { upload, applyForJob } = require('../controllers/applicationController');
const router = express.Router();

// Route for job application
router.post('/apply', upload.single('resume'), applyForJob);

module.exports = router;
