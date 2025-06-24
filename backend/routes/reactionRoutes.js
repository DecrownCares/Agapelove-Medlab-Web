const express = require('express');
const verifyRoles = require('../middleware/verifyRoles');
const verifyJWT = require('../middleware/verifyJWT'); 
const {  logActivity, activityLogger } = require('../middleware/analyticsMiddleware');
const { addReaction, getReactions, getReactionsCount, addCommentReaction, updateReplyReaction, } = require('../controllers/reactionController');

const router = express.Router();

// Add or toggle a reaction
router.post('/reaction', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), addReaction);

// Get reactions for a post
router.get('/reactions/:postId', getReactions);

// Get reaction counts for a post
router.get('/reactions/count/:postId', getReactionsCount);

router.post('/:commentId/reactions', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), addCommentReaction);

// Update a reply reaction

router.post('/replies/:replyId/reaction', activityLogger('click'), logActivity, verifyJWT, verifyRoles('Admin', 'Editor', 'Reader'), updateReplyReaction);

module.exports = router;
