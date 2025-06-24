const Reaction = require('../models/Reaction');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const CommentReaction = require('../models/CommentReaction')
const mongoose = require('mongoose');

// const addReaction = async (req, res) => {
//   const { postId, type } = req.body;

//   // Check for required fields
//   if (!postId || !type) {
//     return res.status(400).json({ message: "Post ID and reaction type are required." });
//   }

//   try {
//     // Check if the user already reacted to this post
//     const existingReaction = await Reaction.findOne({ postId, userId: req.user._id });
    
//     // Handle case where user already reacted
//     if (existingReaction) {
//       if (existingReaction.type === type) {
//         await existingReaction.deleteOne();
        
//         // Decrement reaction count on the post
//         await Post.findByIdAndUpdate(postId, { $inc: { [`reactions.${type}`]: -1 } });
        
//         return res.status(200).json({ message: 'Reaction removed' });
//       }

//       // Update to new reaction type
//       const prevType = existingReaction.type;
//       existingReaction.type = type;
//       await existingReaction.save();

//       // Increment new reaction type and decrement old type
//       await Post.findByIdAndUpdate(postId, {
//         $inc: {
//           [`reactions.${type}`]: 1,
//           [`reactions.${prevType}`]: -1,
//         },
//       });
//       return res.status(200).json(existingReaction);
//     }

//     // Create a new reaction if none exists
//     const newReaction = new Reaction({ postId, userId: req.user._id, type });
//     await newReaction.save();
//     await Post.findByIdAndUpdate(postId, {
//       $inc: { [`reactions.${type}`]: 1 },
//     });

//     // Award points and badge
//     let userPoints = await UserPoints.findOne({ userId: req.user._id });
//     if (!userPoints) {
//       userPoints = new UserPoints({ userId: req.user._id, points: 5 });
//     } else {
//       userPoints.points += 5;
//     }
//     await userPoints.save();

//     // Award badge if it's the user's first reaction
//     const userReactions = await Reaction.find({ userId: req.user._id });
//     if (userReactions.length === 1) {
//       const userBadge = new UserBadge({
//         userId: req.user._id,
//         badgeId: 'first-reaction-badge-id',
//       });
//       await userBadge.save();
//     }

//     res.status(201).json(newReaction);
//   } catch (error) {
//     console.error("Error in addReaction:", error);  // Log full error
//     res.status(500).json({ message: 'Error adding reaction', error: error.message });
//   }
// };


const addReaction = async (req, res) => {
  const { postId, type } = req.body;

  console.log("Request body:", req.body);
  console.log("User ID:", req.user._id);

  // Check for required fields
  if (!postId || !type) {
    return res.status(400).json({ message: "Post ID and reaction type are required." });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID format." });
  }

  try {
    // Check if the user already reacted to this post
    const existingReaction = await Reaction.findOne({ postId, author: req.user._id });

    if (existingReaction) {
      // User already reacted
      if (existingReaction.type === type) {
        // Remove reaction
        await existingReaction.deleteOne();
        await Post.findByIdAndUpdate(postId, { $inc: { [`reactions.${type}`]: -1 } });
        return res.status(200).json({ message: 'Reaction removed' });
      }

      // Update to new reaction type
      const prevType = existingReaction.type;
      existingReaction.type = type;
      await existingReaction.save();

      // Update counts
      await Post.findByIdAndUpdate(postId, {
        $inc: {
          [`reactions.${type}`]: 1,
          [`reactions.${prevType}`]: -1,
        },
      });
      return res.status(200).json(existingReaction);
    }

    // Create a new reaction if none exists
    const newReaction = new Reaction({ postId, author: req.user._id, type });
    await newReaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { [`reactions.${type}`]: 1 } });

    // Optional: Add points and badges
    // ...

    res.status(201).json(newReaction);
  } catch (error) {
    console.error("Error in addReaction:", error);
    res.status(500).json({ message: 'Error adding reaction', error: error.message });
  }
};


const getReactions = async (req, res) => {
  try {
    const reactions = await Reaction.find({ postId: req.params.postId }).populate('userId', 'username');
    res.status(200).json(reactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reactions', error });
  }
};

const getReactionsCount = async (req, res) => {
  try {
    // Aggregate to get reaction counts by type
    const reactions = await Reaction.aggregate([
      { $match: { postId: mongoose.Types.ObjectId(req.params.postId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction._id] = reaction.count;
      return acc;
    }, {});

    res.status(200).json(reactionCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reaction counts', error });
  }
};


// const addCommentReaction = async (req, res) => {
//   const { commentId, type } = req.body;  // Ensure the variable name is consistent

//   console.log("Received commentId:", commentId, "Received type:", type); // Log the received values

//   // Check for required fields
//   if (!commentId || !type) {
//       return res.status(400).json({ message: "Comment ID and reaction type are required." });
//   }

//   try {
//       const existingReaction = await CommentReaction.findOne({ commentId, userId: req.user._id });

//       // Handle case where user already reacted
//       if (existingReaction) {
//           if (existingReaction.type === type) {
//               await existingReaction.deleteOne();

//               // Decrement reaction count on the comment
//               await Comment.findByIdAndUpdate(commentId, { $inc: { [`reactions.${type}`]: -1 } });

//               // Fetch the updated reaction counts
//               const updatedComment = await Comment.findById(commentId);
//               return res.status(200).json({ message: 'Reaction removed', reactionCounts: updatedComment.reactions });
//           }

//           // Update to new reaction type
//           const prevType = existingReaction.type;
//           existingReaction.type = type;
//           await existingReaction.save();

//           // Increment new reaction type and decrement old type
//           await Comment.findByIdAndUpdate(commentId, {
//               $inc: {
//                   [`reactions.${type}`]: 1,
//                   [`reactions.${prevType}`]: -1,
//               },
//           });

//           // Fetch the updated reaction counts
//           const updatedComment = await Comment.findById(commentId);
//           return res.status(200).json({ message: 'Reaction updated', reactionCounts: updatedComment.reactions });
//       } else {
//           // Create a new reaction
//           const newReaction = new CommentReaction({ commentId, userId: req.user._id, type });
//           await newReaction.save();

//           // Increment the reaction count in the Comment model
//           await Comment.findByIdAndUpdate(commentId, {
//               $inc: { [`reactions.${type}`]: 1 },
//           });

//           // Fetch the updated reaction counts
//           const updatedComment = await Comment.findById(commentId);
//           return res.status(201).json({ message: 'Reaction added', reactionCounts: updatedComment.reactions });
//       }
//   } catch (error) {
//       console.error("Error in addCommentReaction:", error);
//       res.status(500).json({ message: 'Error adding reaction', error: error.message });
//   }
// };


const addCommentReaction = async (req, res) => {
  const { commentId, type } = req.body;

  if (!commentId || !type) {
      return res.status(400).json({ message: "Comment ID and reaction type are required." });
  }

  try {
      const existingReaction = await CommentReaction.findOne({ commentId, author: req.user._id });

      if (existingReaction) {
          if (existingReaction.type === type) {
              await existingReaction.deleteOne();
              await Comment.findByIdAndUpdate(commentId, { $inc: { [`reactions.${type}`]: -1 } });
              const updatedComment = await Comment.findById(commentId);
              return res.status(200).json({ message: 'Reaction removed', reactionCounts: updatedComment.reactions });
          }

          const prevType = existingReaction.type;
          existingReaction.type = type;
          await existingReaction.save();
          await Comment.findByIdAndUpdate(commentId, {
              $inc: {
                  [`reactions.${type}`]: 1,
                  [`reactions.${prevType}`]: -1,
              },
          });
          const updatedComment = await Comment.findById(commentId);
          console.log('Recieved CommentId:', commentId);
          
    if (!updatedComment) {
        return res.status(404).json({ message: 'Comment not found' });
    }
          return res.status(200).json({ message: 'Reaction updated', reactionCounts: updatedComment.reactions });
      } else {
          const newReaction = new CommentReaction({ commentId, author: req.user._id, type });
          await newReaction.save();
          await Comment.findByIdAndUpdate(commentId, {
              $inc: { [`reactions.${type}`]: 1 },
          });
          const updatedComment = await Comment.findById(commentId);
          return res.status(201).json({ message: 'Reaction added', reactionCounts: updatedComment.reactions });
      }
  } catch (error) {
      console.error("Error in addCommentReaction:", error);
      res.status(500).json({ message: 'Error adding reaction', error: error.message });
  }
};


// Update reply reaction function
const updateReplyReaction = async (req, res) => {
  const { replyId } = req.params;
  const { replyReactionType, author } = req.body;
  console.log('Server received:', replyId, replyReactionType);

  // Validate reaction type
  if (!['like', 'love', 'haha', 'wow', 'sad', 'angry'].includes(replyReactionType)) {
    return res.status(400).json({ message: 'Invalid reaction type' });
  }

  try {
    // Find the comment that contains the reply
    const comment = await Comment.findOne({ "replies._id": replyId });
    if (!comment) return res.status(404).json({ message: 'Reply not found' });

    // Find the specific reply
    const reply = comment.replies.find(r => r._id.toString() === replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    // Ensure reactions objects are initialized
    reply.replyReactions = reply.replyReactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
    reply.reactionsByUser = reply.reactionsByUser || {};

    // Check if user already reacted
    const existingReactionType = reply.reactionsByUser[author];

    if (existingReactionType) {
      if (existingReactionType === replyReactionType) {
        // Remove existing reaction if clicking the same type
        delete reply.reactionsByUser[author];
        reply.replyReactions[replyReactionType] = Math.max(reply.replyReactions[replyReactionType] - 1, 0);
        await Comment.findOneAndUpdate(
          { "replies._id": replyId },
          {
            $set: { "replies.$.reactionsByUser": reply.reactionsByUser },
            $inc: { [`replies.$.replyReactions.${replyReactionType}`]: -1 }
          }
        );
        return res.status(200).json({ message: 'Reaction removed', reactionCounts: reply.replyReactions });
      } else {
        // Change reaction type (decrement previous, increment new)
        const prevReactionType = existingReactionType;
        reply.reactionsByUser[author] = replyReactionType;
        reply.replyReactions[prevReactionType] = Math.max(reply.replyReactions[prevReactionType] - 1, 0);
        reply.replyReactions[replyReactionType] = (reply.replyReactions[replyReactionType] || 0) + 1;
        await Comment.findOneAndUpdate(
          { "replies._id": replyId },
          {
            $set: { "replies.$.reactionsByUser": reply.reactionsByUser },
            $inc: {
              [`replies.$.replyReactions.${replyReactionType}`]: 1,
              [`replies.$.replyReactions.${prevReactionType}`]: -1
            }
          }
        );
        return res.status(200).json({ message: 'Reaction updated', reactionCounts: reply.replyReactions });
      }
    } else {
      // Add new reaction
      reply.reactionsByUser[author] = replyReactionType;
      reply.replyReactions[replyReactionType] = (reply.replyReactions[replyReactionType] || 0) + 1;
      await Comment.findOneAndUpdate(
        { "replies._id": replyId },
        {
          $set: { "replies.$.reactionsByUser": reply.reactionsByUser },
          $inc: { [`replies.$.replyReactions.${replyReactionType}`]: 1 }
        }
      );
      return res.status(201).json({ message: 'Reaction added', reactionCounts: reply.replyReactions });
    }
  } catch (error) {
    console.error("Error updating reply reaction:", error);
    res.status(500).json({ message: 'Error updating reply reaction', error });
  }
};



















module.exports = {
  addReaction,
  getReactions,
  getReactionsCount,
  addCommentReaction,
  updateReplyReaction,
};