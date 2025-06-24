const express = require('express');
const authController= require('../controllers/authController');
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');

const router = express.Router();

// Route to send password reset link
router.post('/reset-password', authController.sendResetLink);

// Route to confirm password reset
router.post('/reset-password/confirm', authController.staffResetPassword);

router.route('/')
    .post(activityLogger('click'), logActivity, authController.login);

module.exports = router;
