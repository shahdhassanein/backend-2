// The path to your User model schema
const User = require('../models/User'); // Corrected path to your user model file (e.g., User.js)

// --- HELPER FUNCTION: Create token and send response ---
// This function creates a signed JWT, sets it in a secure httpOnly cookie,
// and sends a JSON response.
const sendTokenResponse = (user, statusCode, res) => {
    // Create token using the method from your User schema
    const token = user.getSignedJwtToken();

    const options = {
        // Set cookie to expire in 30 days (matches JWT_COOKIE_EXPIRE in .env)
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        // httpOnly: true makes the cookie inaccessible to client-side JavaScript,
        // which is a crucial security feature.
        httpOnly: true,
    };

    // If in production, add the 'secure' flag to the cookie (for HTTPS only)
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options) // Set the token in the cookie
        .json({
            success: true,
            // You can still send the token in the body if your front-end needs it,
            // but the cookie is the primary, secure transport mechanism.
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role // Using role from your schema instead of isAdmin
            }
        });
};


// --- CONTROLLER FUNCTIONS ---

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // 2. Find user and include the password field for comparison
        const user = await User.findOne({ email }).select('+password');
        
        // Use a generic error message to prevent email enumeration attacks
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Compare entered password with the hashed password in the database
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 4. If credentials are correct, send token and user data
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        // Your schema requires name, email, password, and phone
        const { name, email, password, phone } = req.body;

        // 1. Validate all required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, password, and phone number' });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // 3. Create the new user in the database
        // The password will be automatically hashed by the .pre('save') hook in your schema
        const user = await User.create({
            name,
            email,
            password,
            phone
        });
        
        // 4. Send token and user data as a response (log the user in immediately)
        // A 201 status code means "Created"
        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error('Registration error:', error);
        // Handle potential validation errors from Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages[0] });
        }
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires an authentication middleware)
const getUserProfile = async (req, res) => {
    // This function assumes you have a middleware that verifies the token
    // and attaches the user object to the request (e.g., req.user).
    try {
        // req.user should be populated by your auth middleware
        const user = await User.findById(req.user.id);

        if (user) {
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
        } else {
            // This case is unlikely if your auth middleware is working correctly
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { loginUser, registerUser, getUserProfile };