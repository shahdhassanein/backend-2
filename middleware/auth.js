const jwt = require('jsonwebtoken'); // For creating and verifying JSON Web Tokens
const User = require('../models/usersschema'); // Import your User model

// Protect routes - Ensures only authenticated users can access
exports.protect = async (req, res, next) => {
    let token;

    // --- 1. Attempt to get the token from the request ---
    // First, try to get the token from HTTP-only cookies (recommended for browsers)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // If not found in cookies, check the Authorization header (common for APIs or if client-side JS explicitly sends it)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract the token part
    }

    // Determine if it's an API route based on the URL path
    // API routes typically start with '/api/'
    const isApiRoute = req.originalUrl.startsWith('/api/');

    // --- 2. If no token was found ---
    if (!token) {
        // If it's an API route, always send a JSON error
        if (isApiRoute) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this API route: No token provided'
            });
        } else {
            // If it's a non-API route (e.g., direct browser access to a protected page), redirect to login
            res.cookie('redirectAfterLogin', encodeURIComponent(req.originalUrl), {
                httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript (security)
                maxAge: 5 * 60 * 1000 // Cookie lasts for 5 minutes
            });
            return res.redirect('/login'); // Redirect the user's browser to your login page URL
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
            // For API routes, send JSON error; otherwise, redirect HTML clients
            if (isApiRoute) {
                return res.status(401).json({ success: false, error: 'Not authorized to access this API route: User no longer exists' });
            } else {
                res.cookie('redirectAfterLogin', encodeURIComponent(req.originalUrl), { httpOnly: true, maxAge: 5 * 60 * 1000 });
                return res.redirect('/login');
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

        // For API routes, send JSON error; otherwise, redirect HTML clients
        if (isApiRoute) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this API route: Token invalid or expired'
            });
        } else {
            res.cookie('redirectAfterLogin', encodeURIComponent(req.originalUrl), {
                httpOnly: true,
                maxAge: 5 * 60 * 1000
            });
            return res.redirect('/login');
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
