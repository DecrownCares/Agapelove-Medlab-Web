const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Submit feedback
router.post('/submit', authMiddleware, async (req, res) => {
  const { feedbackText } = req.body;

  try {
    const feedback = new Feedback({ userId: req.user._id, feedbackText });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// Get feedback (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const feedbacks = await Feedback.find().populate('userId');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
});

module.exports = router;
