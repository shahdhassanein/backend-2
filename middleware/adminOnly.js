const jwt = require('jsonwebtoken');
const User = require('../models/usersschema');

const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies (your app uses cookies, not Bearer tokens)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If no token found
    if (!token || token === 'none') {
        // Check if this is an API request or a page request
        if (req.originalUrl.includes('/api/')) {
            return res.status(401).json({ 
                success: false,
                message: 'Not authorized to access this route' 
            });
        } else {
            // For page requests, redirect to login
            return res.redirect('/login');
        }
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            if (req.originalUrl.includes('/api/')) {
                return res.status(401).json({ 
                    success: false,
                    message: 'User not found' 
                });
            } else {
                return res.redirect('/login');
            }
        }
        
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        if (req.originalUrl.includes('/api/')) {
            return res.status(401).json({ 
                success: false,
                message: 'Not authorized - Invalid token' 
            });
        } else {
            return res.redirect('/login');
        }
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Check if this is an API request or a page request
        if (req.originalUrl.includes('/api/')) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized as an admin' 
            });
        } else {
            // For page requests, render an error page
            return res.status(403).render('error', {
                title: 'Access Denied',
                message: 'You need admin privileges to access this page',
                user: req.user
            });
        }
    }
};

// Alternative names for consistency
const authorize = admin;

module.exports = { protect, admin, authorize };