const User = require('../models/User');

const userService = {
  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },
  
  getAllUsers: async () => {
    console.log('get all users')
    return await User.find();
  },

  getUserById: async (id) => {
    return await User.findById(id);
  },

  updateUser: async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  },

  deleteUser: async (id) => {
    return await User.findByIdAndDelete(id);
  }
};

module.exports = userService;
