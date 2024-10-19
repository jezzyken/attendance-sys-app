const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const token = await authService.register(req);
  res.status(201).json({ status: "success", token });
});


const loginTeacher = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const results = await authService.loginTeacher(email, password);
  res.status(200).json({ status: "success", results });
});


const login = catchAsync(async (req, res) => {
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
});

module.exports = { register, login, loginTeacher };
