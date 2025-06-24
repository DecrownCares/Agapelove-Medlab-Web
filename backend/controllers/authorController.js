const Post = require('../models/Post');

const getAuthorDashboard = (req, res) => {
  res.status(200).json({ message: 'Welcome to the Author Dashboard' });
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.id;

  try {
    const post = new Post({ title, content, author });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

const editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error editing post', error });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

module.exports = {
  getAuthorDashboard,
  createPost,
  editPost,
  deletePost,
};
