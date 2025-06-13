// controllers/authcontroller.js
const User = require('../models/usersschema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Needed for password hashing (used by User model pre-save hook)

// Helper function to handle response for EJS views
// Sets session, optional JWT cookie, and redirects
const sendAuthResponse = async (user, statusCode, req, res, isRegistration = false) => {
    // Set user ID in the session (CRITICAL for Dashboard.ejs dynamic data)
    req.session.userId = user._id;
    console.log(`[Auth Controller] Session userId set to: ${req.session.userId}`);

    // --- NEW LOGIC: Dynamically add consentAccepted if missing ---
    // This ensures all existing users automatically get the field on their next login/registration
    if (user.consentAccepted === undefined) { // Check if the field is explicitly undefined/missing
        user.consentAccepted = false; // Set default to false, requiring user to accept
        await user.save(); // Save the user to add this new field
        console.log(`[Auth Controller] Added 'consentAccepted: false' to user ${user.email} as it was missing.`);
    }
    // --- END NEW LOGIC ---

    // Update last login details on the user document
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
        expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000), // Convert days to ms
        httpOnly: true, // HTTP-only for security
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        sameSite: 'Lax', // Protects against CSRF in some cases
    };
    res.cookie('token', token, options); // Set the JWT in the cookie
    console.log(`[Auth Controller] JWT Cookie set for user: ${user.email}`);

    // Determine where to redirect after successful login/registration based on user role
    let redirectUrl;
    if (user.role === 'admin') {
        redirectUrl = '/admin'; // Redirect admin users to /admin page
    } else {
        // Default for 'user' role is now /homepage, unless redirectAfterLogin cookie exists
        redirectUrl = req.cookies.redirectAfterLogin || '/homepage'; 
    }
    res.clearCookie('redirectAfterLogin'); // Clear the redirect cookie after use
    console.log(`[Auth Controller] Redirecting user with role '${user.role}' to: ${redirectUrl}`);

    // Redirect the browser to the appropriate EJS page
    res.redirect(redirectUrl);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => { // Defined as const here, exported at the end
    try {
        const { name, email, password, phone } = req.body;
        console.log(`[Auth Controller] Register attempt for: ${email}`);

        // Basic validation
        if (!name || !email || !password || !phone) {
            console.log('[Auth Controller] Register: Missing fields.');
            return res.render('register', { title: 'Register', error: 'Please provide all required fields: name, email, password, and phone.' });
        }

        const existingUser = await User.findOne({ email });
        console.log(`[Auth Controller] Register: Result of findOne for email '${email}':`, existingUser);
        if (existingUser) {
            console.log('[Auth Controller] Register: Email already exists. Found user with ID:', existingUser._id);
            return res.render('register', { title: 'Register', error: 'User with this email already exists.' });
        }

        // Create new user in the database
        const user = await User.create({
            name,
            email,
            password, // Plain text password passed here, schema hook will hash it
            phone,
            role: 'user' // Default role for public registration
        });
        console.log(`[Auth Controller] User registered successfully with ID: ${user._id}`);

        await sendAuthResponse(user, 201, req, res, true);

    } catch (error) {
        console.error('[Auth Controller] Registration error in catch block:', error);
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
const login = async (req, res, next) => { // Defined as const here, exported at the end
    console.log('*** [Auth Controller] Login function called ***');
    const { email, password } = req.body;
    console.log(`[Auth Controller] Login attempt for email: ${email}`);

    try {
        if (!email || !password) {
            console.log('[Auth Controller] Login: Missing email or password.');
            return res.render('login', { title: 'Login', error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        console.log(`[Auth Controller] Login: User found in DB for email: ${user ? user.email : 'N/A'}`);

        if (!user) {
            console.log('[Auth Controller] Login: User not found.');
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        console.log(`[Auth Controller] Login: Comparing entered password with stored hash for user: ${user.email}`);
        const isMatch = await user.matchPassword(password);
        console.log(`[Auth Controller] Login: Password comparison result (isMatch): ${isMatch}`);

        if (!isMatch) {
            console.log('[Auth Controller] Login failed: Password mismatch for user:', user.email);
            return res.render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        console.log(`[Auth Controller] Login successful for user: ${user.email}. Initiating sendAuthResponse.`);
        await sendAuthResponse(user, 200, req, res);

    } catch (error) {
        console.error('[Auth Controller] Login error:', error);
        res.render('login', { title: 'Login', error: 'Login failed. Please try again.' });
    }
};

/**
 * @desc    Get current logged in user (for API calls, uses req.user from middleware)
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => { // Defined as const here, exported at the end
    try {
        // Ensure req.user is populated by protect middleware
        if (!req.user) {
            console.log('[Auth Controller] getMe: Not authenticated, no user found in req.user.');
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        
        // Explicitly fetch user from DB and exclude password, even if req.user is populated.
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
const logout = (req, res, next) => { // Defined as const here, exported at the end
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

// --- NEW: User Management Functions (for Admin use) ---

/**
 * @desc    Add a new user (by Admin)
 * @route   POST /api/users/add
 * @access  Private/Admin
 */
const addUser = async (req, res) => { // Defined as const here, exported at the end
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, password, and phone for the new user.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const userRole = role && ['user', 'admin'].includes(role) ? role : 'user';

        const newUser = await User.create({
            name,
            email,
            password,
            phone,
            role: userRole
        });

        res.status(201).json({
            success: true,
            message: 'User added successfully!',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error('Error adding user (admin):', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error during user addition.' });
    }
};

/**
 * @desc    Remove a user (by Admin)
 * @route   DELETE /api/users/remove/:id
 * @access  Private/Admin
 */
const removeUser = async (req, res) => { // Defined as const here, exported at the end
    try {
        const { id } = req.params; // Get ID from URL parameters

        // Prevent admin from deleting themselves (optional but recommended)
        if (req.user && req.user._id.toString() === id) {
            return res.status(403).json({ success: false, message: 'Admins cannot delete their own account via this interface.' });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User removed successfully!' });

    } catch (error) {
        console.error('Error removing user (admin):', error);
        res.status(500).json({ success: false, message: 'Server error during user removal.' });
    }
};

/**
 * @desc    Get all users (for Admin dashboard listing)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const listUsers = async (req, res) => { // Defined as const here, exported at the end
    try {
        const users = await User.find().select('-password'); // Fetch all users, exclude passwords
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error listing users (admin):', error);
        res.status(500).json({ success: false, message: 'Server error fetching users.' });
    }
};

// Export all the functions that need to be accessed by routes
module.exports = {
    register,
    login,
    getMe,
    logout,
    addUser,
    removeUser,
    listUsers
};