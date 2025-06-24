const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { getSubscriberDashboard, viewPosts, leaveComment } = require('../controllers/subscriberController');

const router = express.Router();

// Subscriber dashboard
router.get('/dashboard', authMiddleware, roleMiddleware(['Subscriber']), getSubscriberDashboard);

// View posts
router.get('/view-posts', authMiddleware, roleMiddleware(['Subscriber']), viewPosts);

// Leave a comment
router.post('/leave-comment/:postId', authMiddleware, roleMiddleware(['Subscriber']), leaveComment);
 
module.exports = router;
