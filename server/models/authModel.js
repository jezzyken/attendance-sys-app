const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // Add other fields as necessary
});

module.exports = mongoose.model('Auth', authSchema);