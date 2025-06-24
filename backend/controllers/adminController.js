const User = require('../models/User');
const Post = require('../models/Post');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');



const getAllAdmin = async(req, res) => {
  const admins = await Admin.find().populate('blog').exec();
  if (!admins) return res.status(204).json({"message": "No users found"})
  res.json(admins)
}

const createAdmin = async(req, res) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
      return res.status(400).json({"message": "All fields are required"})
  }
  const duplicate = await Admin.findOne({username: username}).exec();
  if (duplicate) {
      return res.sendStatus(409) //Conflict
  }
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await Admin.create( {
          "username":username,
          "email":email,
          "password": hashedPassword
      });
      console.log(result);
      res.status(201).json({"success": `New user ${username} created!`})
      
  }catch (err) {
      res.status(500).json({"message": err.message})
  }
}


const getAdminDashboard = (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
};

const manageUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

const managePosts = async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  };

  // const deletePost = async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     const post = await Post.findById(id);
  //     if (!post) {
  //       return res.status(404).json({ message: 'Post not found' });
  //     }
  
  //     if (post.author.toString() !== req.user.id) {
  //       return res.status(403).json({ message: 'Unauthorized' });
  //     }
  
  //     await post.remove();
  //     res.status(200).json({ message: 'Post deleted successfully' });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error deleting post', error });
  //   }
  // };

module.exports = {
  getAllAdmin,
  createAdmin,
  getAdminDashboard,
  manageUsers,
  managePosts,
  // deletePost,
};
