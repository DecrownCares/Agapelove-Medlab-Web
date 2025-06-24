const express = require('express');
const router = express.Router();
const readerController = require('../controllers/readerController');
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');


router.route('/')
    .get(activityLogger('click'), logActivity, readerController.getAllReaders)
    .post(activityLogger( 'signup'), logActivity, readerController.createReader);

router.route('/:id')
    .get(readerController.getReader)
    .put(readerController.updateReader)
    .delete(readerController.deleteReader);

module.exports = router;