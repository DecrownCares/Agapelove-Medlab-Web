const User = require('../models/User');

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}; 

const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  Object.keys(updateData).forEach((key) => {
    user[key] = updateData[key];
  });

  await user.save();
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.remove();
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
