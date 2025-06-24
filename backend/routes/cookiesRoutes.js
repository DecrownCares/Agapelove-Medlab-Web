const express = require('express');
const router = express.Router();
const { cookieRecommend } = require('../config/cookie');

router.get('/', cookieRecommend);

module.exports = router;