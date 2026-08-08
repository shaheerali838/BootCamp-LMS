const User = require("../../models/User");

// Create User
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Get All Users
const getAllUsers = async () => {
  return await User.find().select("-password").populate("team", "teamName teamCode");
};

// Get User By ID
const getUserById = async (userId) => {
  return await User.findById(userId).select("-password").populate("team", "teamName teamCode");
};

// Update User
const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

// Delete User
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
