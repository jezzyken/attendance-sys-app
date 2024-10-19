const User = require("../models/userModel");
const Teacher = require("../models/teacherModel");

const jwt = require("jsonwebtoken");

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

const register = async (req) => {
  const newUser = await User.create(req.body);
  return { token: signToken(newUser._id) };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Incorrect email or password");
  }
  return { user, token: signToken(user._id, user.role) };
};

const loginTeacher = async (email, password) => {
    console.log(email, password)
  const teacher = await Teacher.findOne({ email }).populate("departmentId");
  if (!teacher || teacher.password !== password) {
    throw new Error("Incorrect email or password");
  }
  return { teacher };
};

module.exports = { register, login, loginTeacher };
