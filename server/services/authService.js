const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authService = {
  login: async (email, password) => {
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
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
