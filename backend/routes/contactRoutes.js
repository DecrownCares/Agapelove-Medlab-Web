const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/submit-contact-form', contactController.submitContactForm);

// Route to fetch submissions
router.get('/messages', contactController.getMessages);

// Route to send a reply
router.post('/send-reply', contactController.sendReply);

router.post('/feedback', contactController.sendFeedback);

module.exports = router;
 