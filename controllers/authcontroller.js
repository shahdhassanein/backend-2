const User = require('../models/usersschema');
const jwt = require('jsonwebtoken');

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
           token,
           user: {
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               phone: user.phone
           }
       });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        console.log('Registration attempt:', { name, email, phone }); // Debug log

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: name, email, password, and phone' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'user'
        });

        console.log('User created successfully:', user._id); // Debug log

        // Send success response
        sendTokenResponse(user, 201, res, true);

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle mongoose validation errors
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
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Send success response
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
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
        res.status(200).json({ 
            success: true, 
            user: req.user 
        });
    } catch (error) {
        console.error('GetMe error:', error);
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
exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    
    res.status(200).json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
};