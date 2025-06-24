const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  replyReactions: { // Reaction counts by type for replies
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
  },
  reactionsByUser: {
    type: Map,
    of: String, // This maps each user ID to their reaction type
    default: {}
  }
});

const commentSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  postId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  replies: [replySchema], // Embedding replies schema
  reactions: { // Reaction counts by type
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Spam'],
    default: 'Approved',
  },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
