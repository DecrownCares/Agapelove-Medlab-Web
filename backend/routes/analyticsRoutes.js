const express = require('express');
const { getAnalyticsData } = require('../middleware/analyticsMiddleware');
const verifyRoles = require('../middleware/verifyRoles');
const verifyJWT = require('../middleware/verifyJWT'); 

const router = express.Router();

// Get analytics data
router.get('/data', verifyJWT, verifyRoles('Admin'), getAnalyticsData);


module.exports = router;
