// controllers/authcontroller.js
const User = require('../models/usersschema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Re-added: Important for password hashing via User model hooks

// Helper function to handle response for EJS views
// Sets session, optional JWT cookie, and redirects
const sendAuthResponse = async (user, statusCode, req, res, isRegistration = false) => {
    // Set user ID in the session (CRITICAL for Dashboard.ejs dynamic data)
    req.session.userId = user._id;
    console.log(`[Auth Controller] Session userId set to: ${req.session.userId}`); // Corrected console.log syntax

    // Update last login details on the user document
    user.sessionInfo = {
        lastLogin: new Date(),
        ipAddress: req.ip, // req.ip gets client's IP address
        device: req.headers['user-agent'] // User-Agent string
    };
    await user.save(); // Save the updated session info to the database
    console.log(`[Auth Controller] User sessionInfo updated and saved to DB.`); // Corrected console.log syntax

    // Optional: Also set a JWT cookie if your app uses JWTs for other API calls
    const token = user.getSignedJwtToken(); // Get JWT token from User model method
    const options = {
        expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000), // Convert days to ms
        httpOnly: true, // HTTP-only for security
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        sameSite: 'Lax', // Protects against CSRF in some cases
    };
    res.cookie('token', token, options); // Set the JWT in the cookie
    console.log(`[Auth Controller] JWT Cookie set for user: ${user.email}`); // Corrected console.log syntax

    // Determine where to redirect after successful login/registration based on user role
    let redirectUrl;
    if (user.role === 'admin') {
        // You would typically have a specific admin dashboard, e.g., '/admin/dashboard'
        // For now, using '/admin' as a placeholder based on your previous mention
        redirectUrl = '/admin'; 
    } else {
        // Default for 'user' role is now /homepage, unless redirectAfterLogin cookie exists
        redirectUrl = req.cookies.redirectAfterLogin || '/homepage'; 
    }
    res.clearCookie('redirectAfterLogin'); // Clear the redirect cookie after use
    console.log(`[Auth Controller] Redirecting user with role '${user.role}' to: ${redirectUrl}`); // Corrected console.log syntax

    // Redirect the browser to the appropriate EJS page
    res.redirect(redirectUrl);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        console.log(`[Auth Controller] Register attempt for: ${email}`); // Corrected console.log syntax

        // Basic validation
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
        const user = await User.create({
            name,
            email,
            password, // Plain text password passed here, schema hook will hash it
            phone,
            role: 'user' // Default role for new registrations
        });
        console.log(`[Auth Controller] User registered successfully with ID: ${user._id}`); // Corrected console.log syntax

        await sendAuthResponse(user, 201, req, res, true);

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
    console.log('*** [Auth Controller] Login function called ***');
    const { email, password } = req.body;
    console.log(`[Auth Controller] Login attempt for email: ${email}`); // Corrected console.log syntax

    try {
        if (!email || !password) {
            console.log('[Auth Controller] Login: Missing email or password.');
            return res.render('login', { title: 'Login', error: 'Please provide email and password' });
        }

        // Find user by email, explicitly select password for comparison
        const user = await User.findOne({ email }).select('+password');
        console.log(`[Auth Controller] Login: User found in DB for email: ${user ? user.email : 'N/A'}`); // Corrected console.log syntax

        if (!user) {
            console.log('[Auth Controller] Login: User not found.');
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        // Check if password matches
        console.log(`[Auth Controller] Login: Comparing entered password with stored hash for user: ${user.email}`); // Corrected console.log syntax
        const isMatch = await user.matchPassword(password);
        console.log(`[Auth Controller] Login: Password comparison result (isMatch): ${isMatch}`); // Corrected console.log syntax

        if (!isMatch) {
            console.log('[Auth Controller] Login failed: Password mismatch for user:', user.email);
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        // Use the new helper to set session/cookie and redirect
        console.log(`[Auth Controller] Login successful for user: ${user.email}. Initiating sendAuthResponse.`); // Corrected console.log syntax
        await sendAuthResponse(user, 200, req, res);

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
        // Ensure req.user is populated by protect middleware
        if (!req.user) {
            console.log('[Auth Controller] getMe: Not authenticated, no user found in req.user.');
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        
        // Explicitly fetch user from DB and exclude password, even if req.user is populated.
        // This is robust against potential middleware issues where sensitive data might leak.
        const user = await User.findById(req.user._id).select('-password');
        
        console.log(`[Auth Controller] getMe: User ID from req.user: ${req.user._id}`);
        if (!user) {
            console.log(`[Auth Controller] getMe: User not found in DB for ID: ${req.user._id}`);
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
        console.log(`[Auth Controller] getMe: User data retrieved for: ${user.email}`);
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
    console.log('[Auth Controller] Logout attempt.');
    req.session.destroy(err => {
        if (err) {
            console.error('[Auth Controller] Error destroying session:', err);
        }
        res.clearCookie('token');
        res.clearCookie('redirectAfterLogin');
        console.log('[Auth Controller] User logged out, redirecting to /login');
        res.redirect('/login');
    });
};