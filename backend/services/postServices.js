const Post = require('../models/Post');

const createPost = async (title, content, author) => {
  const post = new Post({ title, content, author });
  await post.save();
  return post;
};

const getPosts = async () => {
  const posts = await Post.find();
  return posts;
};

const getPostById = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};

const updatePost = async (id, title, content) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error('Post not found');
  }

  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();

  return post;
};

const deletePost = async (id) => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error('Post not found');
  }

  await post.remove();
  return post;
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
