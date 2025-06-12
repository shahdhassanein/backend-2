// This is the code from Step 4. Please ensure your middleware/auth.js file looks EXACTLY like this.
const jwt = require('jsonwebtoken'); // For creating and verifying JSON Web Tokens
const User = require('../models/usersschema'); // Import your User model

// Protect routes - Ensures only authenticated users can access
exports.protect = async (req, res, next) => {
    let token;

    // --- 1. Attempt to get the token from the request ---
    // First, try to get the token from HTTP-only cookies (recommended for browsers)
    // `req.cookies` is populated by the `cookie-parser` middleware (which we'll add in app.js later).
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // If not found in cookies, check the Authorization header (common for APIs or if client-side JS explicitly sends it)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract the token part
    }

    // --- 2. If no token was found ---
    if (!token) {
        // Check if the client expects an HTML response (meaning it's a browser request)
        if (req.accepts('html')) {
            // Save the original URL to a cookie. This cookie will be read by the login page/controller
            // so the user can be redirected back to where they originally intended to go after logging in.
            res.cookie('redirectAfterLogin', encodeURIComponent(req.originalUrl), {
                httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript (security)
                maxAge: 5 * 60 * 1000 // Cookie lasts for 5 minutes
            });
            return res.redirect('/login'); // Redirect the user's browser to your login page URL
        } else {
            // If the client expects a JSON response (e.g., it's an API call from JavaScript), send a JSON error
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    }

    // --- 3. If a token was found, try to verify it ---
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your JWT_SECRET from .env

        // Find the user associated with the decoded token's ID and attach the user object to req.user
        req.user = await User.findById(decoded.id);

        // If the user associated with the token no longer exists in the database (e.g., account deleted)
        if (!req.user) {
            // Clear the invalid token cookie if it exists in the browser
            if (req.cookies && req.cookies.token) {
                res.clearCookie('token'); 
            }
            // Similar to no-token case, redirect HTML clients, send JSON error for API clients
            if (req.accepts('html')) {
                res.cookie('redirectAfterLogin', encodeURIComponent(req.originalUrl), { httpOnly: true, maxAge: 5 * 60 * 1000 });
                return res.redirect('/login');
            } else {
                return res.status(401).json({ success: false, error: 'Not authorized, user no longer exists' });
            }
        }
        
        // If everything is okay (token is valid, user exists), proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err); // Log the actual error for debugging (e.g., token expired, invalid signature)

        // If the token is invalid or expired
        if (req.cookies && req.cookies.token) {
            res.clearCookie('token'); // Clear the bad/expired token from the browser
        }
        
        // Similar to no-token case, redirect HTML clients, send JSON error for API clients
        if (req.accepts('html')) {
            res.cookie('redirectAfterLogin', encodeURIComponent(req.originalUrl), {
                httpOnly: true,
                maxAge: 5 * 60 * 1000
            });
            return res.redirect('/login');
        } else {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed or expired'
            });
        }
    }
};

// Grant access to specific roles (This middleware is for authorization, not authentication, and does not need changes for this flow)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // If the authenticated user's role is not included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next(); // User is authorized, proceed
    };
};