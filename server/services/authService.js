const User = require('../models/userModel');
    const jwt = require('jsonwebtoken');

    const signToken = (id, role) => {
        return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '90d' });
    };

    const register = async (req) => {
        const newUser = await User.create(req.body);
        return { token: signToken(newUser._id) };
    };

    const login = async (email, password) => {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Incorrect email or password');
        }
        return { user, token: signToken(user._id, user.role) };
    };

    module.exports = { register, login };