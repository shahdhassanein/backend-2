// middleware/sessionAuth.js

const User = require('../models/usersschema');

// Middleware to check for session authentication for dashboard
const sessionAuth = async (req, res, next) => {
    // This is the key condition: Check if a session exists AND if it contains a userId
    if (req.session && req.session.userId) {
        // If userId is found in the session, it means the user is potentially logged in.
        // The middleware then tries to fetch the user's full profile from the database.
        try {
            const user = await User.findById(req.session.userId).select('-password');

            if (user) {
                req.user = user; // User found, attach to req.user
                // Populate sessionInfo on req.user for the dashboard
                req.user.sessionInfo = {
                    createdAt: req.session.createdAt,
                    expiresAt: req.session.cookie.expires,
                    remainingMs: req.session.cookie.maxAge,
                    remainingMinutes: Math.floor(req.session.cookie.maxAge / (1000 * 60)),
                };
                next(); // User is authenticated and found, PROCEED to the requested route
            } else {
                // If userId is in session but no user found in DB (e.g., user deleted)
                console.log('User not found in DB for session:', req.session.userId);
                req.session.destroy(err => { // Destroy the invalid session
                    if (err) console.error('Error destroying session for non-existent user:', err);
                    res.redirect('/login'); // Redirect to login
                });
            }
        } catch (error) {
            // Database error or other server-side issue during user lookup
            console.error('Error in sessionAuth middleware:', error);
            req.session.destroy(err => {
                if (err) console.error('Error destroying session during auth error:', err);
                res.redirect('/login'); // Redirect to login
            });
        }
    } else {
        // --- THIS IS THE CRITICAL PART FOR REDIRECTION ---
        // If req.session does NOT exist or req.session.userId is NOT set,
        // it means the user is NOT authenticated via session.
        res.redirect('/login'); // Redirect them to the login page
    }
};

module.exports = sessionAuth;
