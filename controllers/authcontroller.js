// controllers/authcontroller.js
const User = require('../models/usersschema');
const jwt = require('jsonwebtoken');

// Helper function to handle response for EJS views
// Sets session, optional JWT cookie, and redirects
const sendAuthResponse = async (user, statusCode, req, res, isRegistration = false) => { // Added req
    // Set user ID in the session (CRITICAL for Dashboard.ejs dynamic data)
    req.session.userId = user._id;
    console.log(`[Auth Controller] Session userId set to: ${req.session.userId}`);

    // Update last login details on the user document
    // Ensure this matches the sessionInfo schema in your User model
    user.sessionInfo = {
        lastLogin: new Date(),
        ipAddress: req.ip, // req.ip gets client's IP address
        device: req.headers['user-agent'] // User-Agent string
    };
    await user.save(); // Save the updated session info to the database
    console.log(`[Auth Controller] User sessionInfo updated and saved to DB.`);


    // Optional: Also set a JWT cookie if your app uses JWTs for other API calls
    const token = user.getSignedJwtToken(); // Get JWT token from User model method
    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000), // Convert days to ms
        httpOnly: true, // HTTP-only for security
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        sameSite: 'Lax', // Protects against CSRF in some cases
    };
    res.cookie('token', token, options); // Set the JWT in the cookie
    console.log(`[Auth Controller] JWT Cookie set for user: ${user.email}`);

    // Determine where to redirect after successful login/registration
    const redirectAfterLogin = req.cookies.redirectAfterLogin || '/Dashboard';
    res.clearCookie('redirectAfterLogin'); // Clear the redirect cookie after use
    console.log(`[Auth Controller] Redirecting to: ${redirectAfterLogin}`);

    // Redirect the browser to the appropriate EJS page
    res.redirect(redirectAfterLogin);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        console.log(`[Auth Controller] Register attempt for: ${email}`);

        // Basic validation (more robust validation should be in a separate middleware/library)
        if (!name || !email || !password || !phone) {
            console.log('[Auth Controller] Register: Missing fields.');
            return res.render('register', { title: 'Register', error: 'Please provide all required fields: name, email, password, and phone.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('[Auth Controller] Register: Email already exists.');
            return res.render('register', { title: 'Register', error: 'User with this email already exists.' });
        }

        // Create new user in the database
        // The pre('save') hook in the schema will hash the password
        const user = await User.create({
            name,
            email,
            password, // Plain text password passed here, schema hook will hash it
            phone,
            role: 'user' // Default role
        });
        console.log(`[Auth Controller] User registered successfully with ID: ${user._id}`);

        // Use the new helper to set session/cookie and redirect
        // Pass req as an argument
        await sendAuthResponse(user, 201, req, res, true); // Added 'req' and 'await'

    } catch (error) {
        console.error('[Auth Controller] Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        if (error.code === 11000) { // Duplicate key error (e.g., email already exists)
            errorMessage = 'An account with this email already exists.';
        } else if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        }
        res.render('register', { title: 'Register', error: errorMessage });
    }
};

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`[Auth Controller] Login attempt for email: ${email}`);

        // Validate input
        if (!email || !password) {
            console.log('[Auth Controller] Login: Missing email or password.');
            return res.render('login', { title: 'Login', error: 'Please provide email and password' });
        }

        // Find user by email, explicitly select password for comparison
        const user = await User.findOne({ email }).select('+password');
        console.log(`[Auth Controller] Login: User found in DB for email: ${user ? user.email : 'N/A'}`);

        if (!user) {
            console.log('[Auth Controller] Login: User not found.');
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        // Check if password matches
        console.log(`[Auth Controller] Login: Comparing entered password with stored hash for user: ${user.email}`);
        const isMatch = await user.matchPassword(password); // Call method on user instance
        console.log(`[Auth Controller] Login: Password comparison result (isMatch): ${isMatch}`);

        if (!isMatch) {
            console.log('[Auth Controller] Login failed: Password mismatch for user:', user.email);
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        // Use the new helper to set session/cookie and redirect
        // Pass req as an argument
        await sendAuthResponse(user, 200, req, res); // Added 'req' and 'await'

    } catch (error) {
        console.error('[Auth Controller] Login error:', error);
        res.render('login', { title: 'Login', error: 'Login failed. Please try again.' });
    }
};

/**
 * @desc    Get current logged in user (for API calls)
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
    try {
        // req.user is populated by either 'protect' (for JWTs) or 'sessionAuth' middleware
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        console.error('[Auth Controller] GetMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user data'
        });
    }
};

/**
 * @desc    Logout user
 * @route   GET /api/auth/logout
 * @access  Public
 */
exports.logout = (req, res, next) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('[Auth Controller] Error destroying session:', err);
            // Even if session destroy fails, we still try to clear the cookie and redirect
        }
        // Clear the JWT cookie if it exists
        res.clearCookie('token');
        // Clear the redirectAfterLogin cookie if it exists (should have been cleared, but good practice)
        res.clearCookie('redirectAfterLogin');

        console.log('[Auth Controller] User logged out, redirecting to /login');
        res.redirect('/login');
    });
};
