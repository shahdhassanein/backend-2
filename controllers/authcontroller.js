const User = require('../models/usersschema'); // Import your User model
const jwt = require('jsonwebtoken'); // For creating and verifying JSON Web Tokens
const bcrypt = require('bcryptjs'); // For hashing and comparing passwords

// --- Helper function to generate JWT token ---
// This function creates a JWT for a given user ID.
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE, // Token expiration time from your .env
    });
};

// --- Helper function to send token in HTTP-only cookie and handle redirect ---
// This function abstracts the logic of setting the JWT cookie and redirecting the user.
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id); // Generate the JWT

    // Define cookie options for the JWT token
    const options = {
        // Calculate cookie expiration based on JWT_COOKIE_EXPIRE from .env
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Convert days to milliseconds
        httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript (security)
        // Set 'secure' to true in production if your site uses HTTPS
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Lax', // Protects against CSRF attacks, allows cross-site requests for top-level navigations
    };

    // Determine the redirect URL:
    // 1. Prioritize a 'redirectAfterLogin' cookie (set by 'protect' middleware if user tried to access a protected page)
    // 2. Otherwise, default to the 'My Purchases' page.
    let redirectUrl = '/api/bookingsales/view-my-purchases'; // <<< DEFAULT REDIRECT TO MY PURCHASES AFTER LOGIN
    if (res.req.cookies && res.req.cookies.redirectAfterLogin) {
        redirectUrl = decodeURIComponent(res.req.cookies.redirectAfterLogin); // Decode the URL from the cookie
        res.clearCookie('redirectAfterLogin'); // Clear the redirect cookie after it's been used
    }
    
    // Set the JWT token as an HTTP-only cookie and then perform the browser redirect
    res.status(statusCode)
       .cookie('token', token, options)
       .redirect(redirectUrl);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => { // Added 'next' for consistency
    try {
        const { name, email, password, phone, role } = req.body; // 'role' is optional

        // Basic input validation: check if required fields are provided
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Create the new user. The password will be hashed by the pre-save hook in usersschema (Step 1).
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'user', // Default role to 'user' if not specified in request
        });

        // Generate and send the JWT token in a cookie, then redirect
        sendTokenResponse(user, 201, res); // This will use the default redirectUrl (My Purchases)

    } catch (error) {
        console.error('Register error:', error);
        // Handle Mongoose validation errors or other server errors
        res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
};

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => { // Added 'next' for consistency
    try {
        const { email, password } = req.body;

        // Validate email & password inputs
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Find the user by email. '.select('+password')' is crucial because 'password' is 'select: false' in schema.
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password stored in the database
        const isMatch = await user.matchPassword(password);

        // If passwords don't match
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // If credentials are valid, generate and send the JWT token in a cookie, then redirect
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
};

/**
 * @desc    Get current logged in user's details
 * @route   GET /api/auth/me
 * @access  Private (requires authentication via 'protect' middleware)
 */
exports.getMe = async (req, res, next) => { // Added 'next' for consistency
    try {
        // req.user is populated by the 'protect' middleware after successful token verification
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user data', error: error.message });
    }
};

/**
 * @desc    Log user out / clear JWT cookie
 * @route   GET /api/auth/logout
 * @access  Private (or Public, as it just clears a cookie)
 */
exports.logout = (req, res, next) => { // Added 'next' for consistency
    // Clear the 'token' cookie by setting its expiration to a past date or very soon
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    // Send a success response
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};