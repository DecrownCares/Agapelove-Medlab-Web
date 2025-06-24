const Comment = require('../models/Comment');

const addComment = async (content, postId, author) => {
  const comment = new Comment({ content, post: postId, author });
  await comment.save();
  return comment;
};

const getComments = async (postId) => {
  const comments = await Comment.find({ post: postId });
  return comments;
};

const updateComment = async (commentId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  comment.content = content || comment.content;
  await comment.save();

  return comment;
};

const deleteComment = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  await comment.remove();
  return comment;
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
