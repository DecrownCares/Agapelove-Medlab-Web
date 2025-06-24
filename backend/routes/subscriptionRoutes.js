const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  subscribeUserToPlan,
  getUserSubscriptionDetails,
} = require('../controllers/subscriptionController');

const router = express.Router();

// Create a subscription plan
router.post('/plan', authMiddleware, createSubscriptionPlan);

// Get all subscription plans
router.get('/plans', getAllSubscriptionPlans);

// Subscribe a user to a plan
router.post('/subscribe', authMiddleware, subscribeUserToPlan);

// Get user subscription details
router.get('/subscription', authMiddleware, getUserSubscriptionDetails);

module.exports = router;
