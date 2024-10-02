const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authService = {
  login: async (username, password) => {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return { user, token };
  },
};

module.exports = authService;
