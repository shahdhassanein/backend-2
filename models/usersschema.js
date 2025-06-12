const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <<< This import is needed for password hashing

// Define the schema for the User model
const usersschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true, // Removes whitespace from both ends of a string
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, // Ensures email addresses are unique
        lowercase: true, // Stores emails in lowercase
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email' // Basic email regex validation
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6, // Minimum password length
        select: false // Password will NOT be returned by default queries to prevent accidental exposure
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    // --- These fields were previously commented out, now they are active ---
    role: {
        type: String,
        enum: ['user', 'admin'], // Role can only be 'user' or 'admin'
        default: 'user' // Default role if not specified
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets creation timestamp
    }
});

// --- Pre-save hook to hash password before saving the user document ---
// This runs before a 'save' operation on a user document.
usersschema.pre('save', async function (next) {
    // Only hash the password if it's new or has been modified
    // This prevents re-hashing an already hashed password on subsequent saves
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt (a random string)
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
        next(); // Proceed to save the user document
    } catch (err) {
        // If an error occurs during hashing, pass it to the next middleware
        return next(err);
    }
});

// --- Method to compare an entered password with the stored hashed password ---
// This method will be available on user instances (e.g., user.matchPassword(enteredPass))
usersschema.methods.matchPassword = async function (enteredPassword) {
    // Uses bcrypt.compare to check if the entered plain password matches the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', usersschema);