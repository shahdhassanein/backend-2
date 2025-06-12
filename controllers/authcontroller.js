const User = require('../models/usersschema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <<< ADDED: For password hashing

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res, isRegistration = false) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    };

    // Always send JSON response for API endpoints
    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           success: true,
           message: isRegistration ? 'Registration successful!' : 'Login successful!',
           // Removed token from direct JSON response for security, it's in cookie
           user: {
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               phone: user.phone
           }
       });
    console.log(`sendTokenResponse: Sent ${statusCode} status for ${isRegistration ? 'registration' : 'login'}.`); // Log final send
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        console.log('Registration attempt:', { name, email, phone });

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: name, email, password, and phone' 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // <<< CRITICAL FIX: HASH PASSWORD BEFORE SAVING >>>
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Register: Hashed password for new user.');

        const user = await User.create({
            name,
            email,
            password: hashedPassword, // <<< IMPORTANT: Save the HASHED password
            phone,
            role: 'user'
        });

        console.log('User created successfully:', user._id);

        sendTokenResponse(user, 201, res, true);

    } catch (error) {
        console.error('Registration error (Caught exception):', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    console.log('*** Login function called ***');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    // console.log('Login attempt with password (raw input - do not log in production!):', password); // KEEP COMMENTED FOR SECURITY

    try {
        // Validate input
        if (!email || !password) {
            console.log('Login failed: Missing email or password.');
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }

        // Find user, explicitly select password
        const user = await User.findOne({ email }).select('+password');
        console.log('Login: User found in DB for email:', user ? user.email : 'None');

        if (!user) {
            console.log('Login failed: User NOT found for email:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Check password using the method on the User model
        console.log('Login: Comparing entered password with stored hash for user:', user.email);
        // CRITICAL: Ensure `matchPassword` is defined on your `usersschema.js`
        // e.g., userSchema.methods.matchPassword = async function (enteredPassword) { return await bcrypt.compare(enteredPassword, this.password); };
        const isMatch = await user.matchPassword(password); 
        console.log('Login: Password comparison result (isMatch):', isMatch);

        if (!isMatch) {
            console.log('Login failed: Password mismatch for user:', user.email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Send success response with token in cookie
        console.log('Login successful: Sending token response for user:', user.email);
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error (Caught exception):', error); // Log the actual error for debugging
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined // Only show full error in dev
        });
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        // req.user is populated by 'protect' middleware
        console.log('getMe: req.user:', req.user ? req.user._id : 'Not available');
        if (!req.user || !req.user._id) {
             console.log('getMe: Not authorized, no user ID from token.');
            return res.status(401).json({ success: false, message: 'Not authorized, no user ID from token' });
        }

        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            console.log('getMe: User not found in DB for ID:', req.user._id);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ 
            success: true, 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
        console.log('getMe: User data retrieved for:', user.email);

    } catch (error) {
        console.error('GetMe error (Caught exception):', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Logout user
 * @route   GET /api/auth/logout
 * @access  Public
 */
exports.logout = (req, res) => {
    console.log('Logout attempt.');
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds (short for logout)
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    
    res.status(200).json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
    console.log('Logged out successfully, token cookie cleared.');
};