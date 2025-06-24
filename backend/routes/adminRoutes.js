const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');


router.route('/')
.get(adminController.getAllAdmin) 
.post(activityLogger('signup'), logActivity, adminController.createAdmin);

module.exports = router;