const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAuthorDashboard, createPost, editPost, deletePost } = require('../controllers/authorController');

const router = express.Router();

// Author dashboard
router.get('/dashboard', authMiddleware, roleMiddleware(['Author']), getAuthorDashboard);

// Create a new post
router.post('/create-post', authMiddleware, roleMiddleware(['Author']), createPost);

// Edit a post
router.put('/edit-post/:id', authMiddleware, roleMiddleware(['Author']), editPost);

// Delete a post
router.delete('/delete-post/:id', authMiddleware, roleMiddleware(['Author']), deletePost);

module.exports = router;
