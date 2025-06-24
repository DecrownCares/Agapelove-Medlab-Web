const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verifyRoles = require('../middleware/verifyRoles');
const verifyJWT = require('../middleware/verifyJWT');  
const upload = require('../middleware/upload');
const { activityLogger, logActivity } = require('../middleware/analyticsMiddleware');



// Route to delete multiple posts (bulk delete)
router.post('/posts/bulk-delete',verifyJWT, verifyRoles('Admin'), postController.bulkDeletePosts);

// Route to archive multiple posts (bulk archive)
router.post('/posts/bulk-archive', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'), postController.bulkArchivePosts);

// Get all posts for Admin
router.get("/admin-posts", activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'), postController.getAdminPosts);

router.route('/')
    .post(activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'), upload.single('image'), async (req, res, next) => {
        try {
            console.log('User verified:', req.user); // Log the verified user
            await postController.createPost(req, res); // Wait for the post creation to finish
        } catch (error) {
            next(error); // Pass any errors to the error-handling middleware
        }
    });

router.route('/:slug')
    .put(activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'), upload.single('image'), postController.updatePost)
    .delete(activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin'),postController.deletePost);

module.exports = router
