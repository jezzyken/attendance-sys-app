const authService = require("../services/authService");

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { user, token } = await authService.login(username, password);
      res
        .status(200)
        .json({ user: { username: user.username, role: user.role }, token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
};

module.exports = authController;
