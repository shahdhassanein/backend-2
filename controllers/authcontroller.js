// controllers/authcontroller.js
const User = require('../models/usersschema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <<< ADDED: Import bcryptjs

// Helper function to handle response for EJS views
// Sets session, optional JWT cookie, and redirects
const sendAuthResponse = async (user, statusCode, req, res, isRegistration = false) => {
    // Set user ID in the session (CRITICAL for Dashboard.ejs dynamic data)
    req.session.userId = user._id;
    console.log(`[Auth Controller] Session userId set to: ${req.session.userId}`);

    // Update last login details on the user document
    user.sessionInfo = {
        lastLogin: new Date(),
        ipAddress: req.ip,
        device: req.headers['user-agent']
    };
    await user.save();
    console.log(`[Auth Controller] User sessionInfo updated and saved to DB.`);

    // Optional: Also set a JWT cookie if your app uses JWTs for other API calls
    const token = user.getSignedJwtToken(); // Get JWT token from User model method
    const options = {
        expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    };
    res.cookie('token', token, options);
    console.log(`[Auth Controller] JWT Cookie set for user: ${user.email}`);

    // Determine where to redirect after successful login/registration
    const redirectAfterLogin = req.cookies.redirectAfterLogin || '/Dashboard';
    res.clearCookie('redirectAfterLogin');
    console.log(`[Auth Controller] Redirecting to: ${redirectAfterLogin}`);

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

        if (!name || !email || !password || !phone) {
            console.log('[Auth Controller] Register: Missing fields.');
            return res.render('register', { title: 'Register', error: 'Please provide all required fields: name, email, password, and phone.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('[Auth Controller] Register: Email already exists.');
            return res.render('register', { title: 'Register', error: 'User with this email already exists.' });
        }

        const user = await User.create({
            name,
            email,
            password, // Plain text password passed here, schema hook will hash it
            phone,
            role: 'user'
        });
        console.log(`[Auth Controller] User registered successfully with ID: ${user._id}`);

        await sendAuthResponse(user, 201, req, res, true);

    } catch (error) {
        console.error('[Auth Controller] Registration error:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        if (error.code === 11000) {
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
    console.log(`[Auth Controller] Login attempt for email: ${email}`);
    // console.log(`[Auth Controller] Login attempt with password (raw input - DO NOT LOG IN PRODUCTION!): ${password}`); // KEEP COMMENTED FOR SECURITY

    try {
        if (!email || !password) {
            console.log('[Auth Controller] Login: Missing email or password.');
            return res.render('login', { title: 'Login', error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        console.log(`[Auth Controller] Login: User found in DB for email: ${user ? user.email : 'N/A (user not found)'}`);

        if (!user) {
            console.log('[Auth Controller] Login failed: User not found for email:', email);
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        console.log(`[Auth Controller] Login: Comparing entered password with stored hash for user: ${user.email}`);
        const isMatch = await user.matchPassword(password);
        console.log(`[Auth Controller] Login: Password comparison result (isMatch): ${isMatch}`);

        if (!isMatch) {
            console.log(`[Auth Controller] Login failed: Password mismatch for user: ${user.email}`);
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        console.log(`[Auth Controller] Login successful for user: ${user.email}. Initiating sendAuthResponse.`);
        await sendAuthResponse(user, 200, req, res);

    } catch (error) {
        console.error('[Auth Controller] Login error (Caught exception):', error);
        // Ensure error.message is available for logging in development
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Login failed. Please try again.';
        res.render('login', { title: 'Login', error: errorMessage });
    }
};

/**
 * @desc    Get current logged in user (for API calls)
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            console.log('[Auth Controller] getMe: Not authenticated, no user found in req.user.');
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        console.log(`[Auth Controller] getMe: User ID from req.user: ${req.user._id}`);
        const user = await User.findById(req.user._id).select('-password');
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
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch user data.';
        res.status(500).json({
            success: false,
            message: errorMessage
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