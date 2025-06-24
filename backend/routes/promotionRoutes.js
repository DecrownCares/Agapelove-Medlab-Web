const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// Create a new promotion and send it to recipients
router.post('/', promotionController.createPromotion);

// Fetch all promotions with filtering, sorting, and pagination
router.get('/', promotionController.getPromotions);

// Resend a specific promotion to its original recipients
router.post('/resend/:id', promotionController.resendPromotion);

// Delete a specific promotion
router.delete('/:id', promotionController.deletePromotion);

module.exports = router;
