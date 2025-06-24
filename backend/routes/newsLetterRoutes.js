const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsLetterController');

router.post('/subscribe', newsletterController.subscribe);
router.put('/unsubscribe/:id', newsletterController.unsubscribe);
// Get subscriptions
router.get('/subscriptions', newsletterController.getSubscriptions);

// Re-subscribe user
router.put('/subscriptions/:id/resubscribe', newsletterController.resubscribeUser);
// Route to track email engagement (opened/clicked)
router.post('/track-engagement', newsletterController.trackEngagement);

// Route to schedule a newsletter
router.post('/schedule', newsletterController.scheduleNewsletter);

// Route to send a newsletter immediately
router.post('/send', newsletterController.sendNewsletterNow);

router.post('/send-now', newsletterController.sendNewsletterManually); 

module.exports = router;
