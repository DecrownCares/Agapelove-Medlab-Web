const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const upload = require('../../middleware/upload');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT'); 
const { logActivity, activityLogger } = require('../../middleware/analyticsMiddleware');


// router.get('/manage-users', verifyJWT, verifyRoles('Admin',), UserController.viewUsers);

// router.post('/assign-role', verifyJWT, verifyRoles('Admin'), UserController.assignRole);
router.get('/author/:username', UserController.getAuthorDetails);

router.get('/authors', UserController.getAuthors);

router.patch('/update-profile', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Author'), UserController.updateUserField);

router.put('/:username/role',activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'), UserController.updateUserRole);

router.put('/update-avatar', activityLogger('click'), logActivity, verifyJWT, UserController.updateAvatar);

router.post('/upload-avatar', activityLogger('click'), logActivity, verifyJWT, upload.single('avatar'), UserController.uploadAvatar);


router.route('/')
    .get(verifyJWT, activityLogger('click'), logActivity, verifyRoles('Admin', 'Editor'), UserController.getAllUsers)
    .post(activityLogger('signup'), logActivity, UserController.createUser);

// Separate route for searching users by username
router.route('/search')
    .get(activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), UserController.searchUsersByUsername);


router.route('/:id')
    .get(activityLogger('click'), logActivity, verifyJWT, UserController.getUserById) // Ensure JWT is verified for user details
    .put(activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor'), UserController.updateUser)
    .delete(activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'), UserController.deleteUser);

// Separate route for user profile
router.route('/profile/:id')
    .get(verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), UserController.getUserProfile);

module.exports = router;
