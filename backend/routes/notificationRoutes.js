const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createNotification, getUserNotifications, markNotificationAsRead } = require('../controllers/notificationController');

const router = express.Router();

// Create a notification
router.post('/create', authMiddleware, createNotification);

// Get user notifications
router.get('/', authMiddleware, getUserNotifications);

// Mark notification as read
router.patch('/:id/read', authMiddleware, markNotificationAsRead);

module.exports = router;
