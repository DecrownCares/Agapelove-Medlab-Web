const express = require('express');
const router = express.Router();
const editorController = require('../controllers/editorController');
const { route } = require('./root');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');


router.route('/')
    .post(activityLogger('signup'), logActivity, editorController.createEditor)
    .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),editorController.getAllEditors)
router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),editorController.getEditor)

module.exports = router;