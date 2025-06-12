// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersschema = new mongoose.Schema({
    // ... your schema code ...
    name: { type: String, required: [true, 'Please provide a name'] },
    email: { type: String, required: [true, 'Please provide an email'], unique: true, match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email' ]},
    password: { type: String, required: [true, 'Please provide a password'], minlength: 6, select: false },
    phone: { type: String, required: [true, 'Please provide a phone number'] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
    // I've removed the cart for simplicity in this login example, but you can keep it.
});

usersschema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is new/modified
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Match user entered password to hashed password in database
usersschema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', usersschema);