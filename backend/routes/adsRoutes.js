const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const { uploadAd, getAds, deleteAd } = require('../controllers/adsController');

router.post('/upload', upload.single('adImage'), uploadAd);
router.get('/get', getAds);
router.delete('/delete', deleteAd);

module.exports = router;
