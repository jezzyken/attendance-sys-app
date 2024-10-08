const User = require("../models/User");

const userService = {
  createUser: async (data) => {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const user = new User(data);
    await user.save();
    return user;
  },

  getAllUsers: async () => {
    console.log("get all users");
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
  },
};

module.exports = userService;
