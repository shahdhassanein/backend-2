// middleware/sessionAuth.js

const User = require('../models/usersschema');

// Middleware to check for session authentication for dashboard
const sessionAuth = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');

            if (user) {
                req.user = user; 

                // --- NEW: Add session-related info to req.user for easy access in templates ---
                req.user.sessionInfo = {
                    createdAt: req.session.createdAt, // This might be available if connect-mongo adds it
                    expiresAt: req.session.cookie.expires, // Date object of when session expires
                    remainingMs: req.session.cookie.maxAge, // Remaining life in milliseconds
                    remainingMinutes: Math.floor(req.session.cookie.maxAge / (1000 * 60)), // Remaining life in minutes
                    // You can also calculate the total period if needed, by adding maxAge to createdAt
                };
                // --- END NEW ---

                next(); 
            } else {
                console.log('User not found in DB for session:', req.session.userId);
                req.session.destroy(err => { 
                    if (err) console.error('Error destroying session for non-existent user:', err);
                    res.redirect('/login'); 
                });
            }
        } catch (error) {
            console.error('Error in sessionAuth middleware:', error);
            req.session.destroy(err => { 
                if (err) console.error('Error destroying session during auth error:', err);
                res.redirect('/login'); 
            });
        }
    } else {
        res.redirect('/login');
    }
};

module.exports = sessionAuth;