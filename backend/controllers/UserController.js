
const User = require('../models/User');
const Admin = require('../models/Admin');
const Post = require('../models/Post')
const bcrypt = require('bcryptjs');


const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if(!username || !email || !password) {
      return res.status(400).json({message: "All fields are required"});
  }
  const duplicate = await User.findOne({email});
  if(duplicate) {
      return res.status(400).json({message: "User already exists"});
  }
  try{
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.create( {
          "username":username,
          "email":email,
          "password": hashedPassword
      });
      console.log(result);
      
      res.status(201).json({"success": `New user ${username} created!`})
  } catch(err) {
      res.status(500).json({message: err.message});
  }
}


const getUserProfile = async (req, res) => {
  try {
    console.log('Authenticated user:', req.user); // Debugging line
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message,
    });
  }
};





const searchUsersByUsername = async (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  try {
    const users = await User.find({ username: { $regex: search, $options: 'i' } }).select('username');

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};




// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    // Use the userId parameter to find the user by ID
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the user from the database
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const { username } = req.params; // Assuming the post ID is passed
    const { type } = req.body; // The new status (e.g., 'published', 'draft', 'archived')
    console.log('req username:', username);
    
    

    const user = await User.findOne({username: username});

    if (!user) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure only the status field is updated without altering other required fields
    user.type = type || user.type;

    // Set the published date only if transitioning to 'published' for the first time
    if (type === 'Admin' && !user.updatedAt) {
      user.updatedAt = new Date(); // Record the first published date
    }

    // Use `save()` with minimal changes to ensure no validation errors from untouched fields
    await user.save({ validateModifiedOnly: true });

    console.log('Updated user type:', user.type);

    res.status(200).json({ message: 'User type updated successfully', user });
  } catch (error) {
    console.error('Error updating user type:', error);
    res.status(500).json({ message: 'Error updating user type', error });
  }
};

const updateUserField = async (req, res) => {
  const { field, subField, value } = req.body;
  const allowedFields = ['bio', 'education', 'workExperience', 'specialty', 'awards', 'socialMediaHandles'];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid field for update.' });
  }

  try {
    const userId = req.user._id;
    let updateData;

    if (field === 'socialMediaHandles' && subField) {
      // Update specific social media handle
      updateData = { [`socialMediaHandles.${subField}`]: value };
    } else {
      // Update non-nested field
      updateData = { [field]: value };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `${field} updated successfully`, updatedUser });
  } catch (error) {
    console.error('Error updating profile field:', error);
    res.status(500).json({ message: 'Failed to update profile field', error: error.message });
  }
};




const updateAvatar = async (req, res) => {
  try {
      const userId = req.user._id; // Extracted from JWT
      const { avatar } = req.body;

      if (!avatar) return res.status(400).json({ error: 'No avatar selected' });

      // Update user's avatar
      const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true });

      // Update avatar in all comments
      // await Comment.updateMany(
      //     { 'author.username': user.username },
      //     { $set: { 'author.avatar': avatar } }
      // );

      res.status(200).json({ message: 'Avatar updated successfully!', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update avatar' });
  }
};


const uploadAvatar = async (req, res) => {
  try {
    // Ensure file was uploaded 
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Update user's avatar in the database
    const userId = req.user._id;
    const avatarPath = `/uploads/${req.file.filename}`; // Path to the uploaded file

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
}


const getAuthorDetails = async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 6 } = req.query;

  try {
    const author = await User.findOne({ username })
      .select('username avatar bio education workExperience awards socialMediaHandles createdAt')
      .lean();

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const articleCount = await Post.countDocuments({ author: author._id });
    const categories = await Post.aggregate([
      { $match: { author: author._id } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
    ]);

    const posts = await Post.find({ author: author._id })
      .sort({ createdAt: -1 }) // Sort by latest
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title image content categories slug createdAt');

    res.json({
      authorDetails: author,
      articleCount,
      categories,
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(articleCount / limit),
    });
  } catch (error) {
    console.error('Error fetching author details:', error);
    res.status(500).json({ message: 'Failed to fetch author details' });
  }
};


const getAuthors = async (req, res) => {
  try {
    const userTypes = ['Admin', 'Editor', 'Author'];

    // Filter users by type and sort by creation date (ascending)
    const users = await User.find({ type: { $in: userTypes } })
      .sort({ createdAt: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};




const awardPoints = async (req, res) => {
  const { userId, points } = req.body;
  try {
    let userPoints = await UserPoints.findOne({ userId });

    if (!userPoints) {
      userPoints = new UserPoints({ userId, points });
    } else {
      userPoints.points += points;
    }

    await userPoints.save();
    res.status(200).json(userPoints);
  } catch (error) {
    res.status(500).json({ message: 'Error awarding points', error });
  }
};

const awardBadge = async (req, res) => {
  const { userId, badgeId } = req.body;
  try {
    const userBadge = new UserBadge({ userId, badgeId });
    await userBadge.save();
    res.status(200).json(userBadge);
  } catch (error) {
    res.status(500).json({ message: 'Error awarding badge', error });
  }
};

const getUserBadges = async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ userId: req.params.userId }).populate('badgeId');
    res.status(200).json(userBadges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching badges', error });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const userPoints = await UserPoints.findOne({ userId: req.params.userId });
    res.status(200).json(userPoints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching points', error });
  }
};

module.exports = {
  createUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  searchUsersByUsername,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserField,
  updateAvatar,
  uploadAvatar,
  getAuthorDetails,
  getAuthors,
  awardPoints,
  awardBadge,
  getUserBadges,
  getUserPoints,
};
