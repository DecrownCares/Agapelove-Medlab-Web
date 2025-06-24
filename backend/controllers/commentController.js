
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const forbiddenWords = ["hate", "violence", "filthy", "abusive"]; // Add your forbidden words here

const isContentValid = (content) => {
  return !forbiddenWords.some(word => content.toLowerCase().includes(word));
};

// const addComment = async (req, res) => {
//   const { postId } = req.params;
//   const { content } = req.body;
//   const author = req.user.id;

//   if (!isContentValid(content)) {
//     return res.status(400).json({ message: 'Comment contains inappropriate language.' });
//   }

//   try {
//     const comment = new Comment({ content, postId, userId: author });
//     await comment.save();

//     // Award points for commenting
//     let userPoints = await UserPoints.findOne({ userId: author });
//     if (!userPoints) {
//       userPoints = new UserPoints({ userId: author, points: 10 });
//     } else {
//       userPoints.points += 10;
//     }
//     await userPoints.save();

//     // Award badge for first comment
//     const userComments = await Comment.find({ userId: author });
//     if (userComments.length === 1) {
//       const userBadge = new UserBadge({ userId: author, badgeId: 'first-comment-badge-id' });
//       await userBadge.save();
//     }

//     res.status(201).json(comment);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding comment', error });
//   }
// };

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = req.user._id;

  console.log("Request body:", req.body);
  console.log("Request body:", req.params);
  console.log("Author:", req.user._id);

  if (!content) {
      return res.status(400).json({ message: 'Comment content is required.' });
  }

  try {
      // Log inputs to ensure they're correct
      console.log("Adding comment:", { content, author, postId });
      
      const comment = new Comment({ content, author, postId });
      await comment.save();

      // Update the post to include the new comment ID
      await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

      res.status(201).json(comment);
  } catch (error) {
      console.error("Error adding comment:", error.message || error);
      res.status(500).json({ message: 'Error adding comment', error: error.message || error });
  }
};




// const getComments = async (req, res) => {
//   const { postId } = req.params;

//   try {
//     // Fetch comments with user data populated
//     const comments = await Comment.find({ postId })
//       .populate('userId', 'username')
//       .select('_id content userId createdAt commentReactions');
//     console.log('Fetched Comments:', comments); // Log the fetched comments

//     // Aggregate reactions counts for each comment
//     const commentIds = comments.map(comment => comment._id);
//     const reactions = await CommentReaction.aggregate([
//       { $match: { commentId: { $in: commentIds } } },
//       { $group: { _id: { commentId: "$commentId", type: "$type" }, count: { $sum: 1 } } }
//     ]);
//     console.log('Aggregated Reactions:', reactions); // Log the reactions count aggregation

//     // Map the reaction counts to each comment
//     const commentReactionsMap = {};
//     reactions.forEach(({ _id, count }) => {
//       const { commentId, type } = _id;
//       if (!commentReactionsMap[commentId]) {
//         commentReactionsMap[commentId] = { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
//       }
//       commentReactionsMap[commentId][type] = count;
//     });
//     console.log('Comment Reactions Map:', commentReactionsMap); // Log the reactions map

//     // Add the aggregated reactions to each comment object
//     const commentsWithReactions = comments.map(comment => ({
//       ...comment.toObject(),
//       commentReactions: commentReactionsMap[comment._id] || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 }
//     }));
//     console.log('Comments with Reactions:', commentsWithReactions); // Final result to be sent as response

//     res.status(200).json(commentsWithReactions);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).json({ message: 'Error fetching comments', error });
//   }
// };


const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    // Check if the postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Fetch the comments associated with the postId
    const comments = await Comment.find({ postId })
      .populate({
        path: 'author', // Assuming `author` field in comments references a User
        select: 'username avatar'
      })
      .lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

    // If no comments found
    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    // Send the comments (with reactions) back to the client
    res.status(200).json({ comments });

  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};









const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isContentValid(content)) {
    return res.status(400).json({ message: 'Comment contains inappropriate language.' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Unauthorized to update this comment' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId, 
      { $set: { content } }, 
      { new: true, runValidators: true } // Return updated doc and run validators
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await comment.remove();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

const replyToComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const author = req.user._id;

  if (!isContentValid(content)) {
    return res.status(400).json({ message: 'Reply contains inappropriate language.' });
  }

  try {
    const comment = await Comment.findOne({ _id: commentId, postId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Add reply to the comment's replies array
    const reply = { content, author: author };
    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({ message: 'Reply added successfully', reply });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error });
  }
};


module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  replyToComment,
};
