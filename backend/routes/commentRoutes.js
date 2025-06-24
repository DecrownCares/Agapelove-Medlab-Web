const express = require('express');
const verifyRoles = require('../middleware/verifyRoles');
const verifyJWT = require('../middleware/verifyJWT'); 
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');
const { addComment, getComments, updateComment, deleteComment, replyToComment } = require('../controllers/commentController');

const router = express.Router();

// Add a comment
router.post('/:postId',activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), addComment);

// Get comments for a post
router.get('/:postId', getComments);

// Update a comment
router.put('/:commentId', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), updateComment);

// Delete a comment
router.delete('/:commentId', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), deleteComment);

// Reply to a comment
router.post('/:postId/comment/:commentId/reply', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), replyToComment);


module.exports = router;
