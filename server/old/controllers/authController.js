const authService = require("../services/authService");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res
        .status(200)
        .json({
          user: {
            username: user.username,
            username: user.username,
            role: user.role,
          },
          token,
        });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
};

module.exports = authController;
