const mongoose = require('mongoose');

const commentReactionSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

const CommentReaction = mongoose.model('CommentReaction', commentReactionSchema);
module.exports = CommentReaction;
