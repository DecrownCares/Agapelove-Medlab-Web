const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const postController = require('../controllers/postController');
const Subscriber = require('../models/Subscription');
const { logActivity, activityLogger } = require('../middleware/analyticsMiddleware');

dotenv.config();

// More specific routes
router.get('/topHeadlines', postController.getTopHeadlines);
router.get('/trending', postController.getTrendingPosts);
router.get('/top-pick', postController.getTopPosts);
router.get('/homepage-posts', postController.getHomePagePosts);
router.get('/layout', postController.getPostsForLayout);
router.get("/search", activityLogger('click'), logActivity, postController.searchQuery);
router.get('/get-vapid-key', (req, res) => {
    res.json({ publicVapidKey: process.env.PUBLIC_VAPID_KEY });
});

router.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    const token = req.query.token || null;
    let patientId = null;

    // Decode token if exists
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        patientId = decoded.id; // Extract patient ID from token
      } catch (err) {
        console.log('Invalid token, treating as visitor');
      }
    }

    // Check if subscription already exists
    const exists = await Subscriber.findOne({ endpoint: subscription.endpoint });

    if (!exists) {
      const newSubscription = new Subscriber({
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
        patientId: patientId || null // Set patientId properly here
      });

      await newSubscription.save();
    } else {
      // Optionally update existing subscription's patientId (if empty and token provided)
      if (!exists.patientId && patientId) {
        exists.patientId = patientId;
        await exists.save();
      }
    }

    res.status(200).json({ message: 'Subscription saved successfully!' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Error saving subscription', error });
  }
});

  

// Dynamic route with :type parameter (must be placed after the above routes)
router.get('/local-world/:type', postController.getPostsByType);

router.get('/:slug/preview-post', activityLogger('click'), logActivity, postController.getPostPreviewById);

router.put('/:id/status', activityLogger('click'), logActivity, postController.updatePostStatus);

// Get all posts
router.get('/all/blog-list', activityLogger('click'), logActivity, postController.renderPostListPage);
router.get('/', activityLogger('click'), logActivity, postController.getPosts);


// Get a specific post by slug
router.get('/post/:slug', postController.renderPostPage);
router.get('/blog/post/:slug', activityLogger('visitor'), logActivity, postController.getPostBySlug, (req, res) => {
  console.log("Post route accessed")
});

module.exports = router;
