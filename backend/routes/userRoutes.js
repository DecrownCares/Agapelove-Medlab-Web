const express = require('express');
const verifyRoles = require('../middleware/verifyRoles');
const verifyJWT = require('../middleware/verifyJWT'); 
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');
const patientController = require('../controllers/patientController');
const upload = require('../middleware/upload');
const router = express.Router();



router.get('/login-history', activityLogger('click'), logActivity, verifyJWT, patientController.getLoginHistory);

router.get('/patient-results', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Patient'), patientController.getResults);

router.get('/details/:labPatientId', activityLogger('click'), logActivity, verifyJWT, patientController.getPatientById);

router.patch('/update-profile', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Patient'), patientController.updatePatientProfile);

router.post('/upload-image', activityLogger('click'), logActivity, verifyJWT, upload.single('image'), patientController.uploadAvatar);

router.route('/profile/:id')
    .get(verifyJWT, verifyRoles('Patient'), patientController.getPatientProfile);


module.exports = router;
