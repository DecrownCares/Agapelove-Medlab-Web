const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getSubscriberDashboard = (req, res) => {
  res.status(200).json({ message: 'Welcome to the Subscriber Dashboard' });
};

const viewPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Published' });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

const leaveComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = req.user.id;

  try {
    const comment = new Comment({ content, post: postId, author });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error leaving comment', error });
  }
};

module.exports = {
  getSubscriberDashboard,
  viewPosts,
  leaveComment,
};
