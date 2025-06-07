
const jwt = require('jsonwebtoken'); 

/**
 * @param {string} id - The user's MongoDB ObjectId.
 * @returns {string} The generated JWT token.
 */
const generateToken = (id) => {
    return jwt.sign(
        { id }, // user id ally 3ayza a7oto fel token
        process.env.JWT_SECRET, //dah al secret key al 3amalto fel env
        {
            expiresIn: process.env.JWT_EXPIRE, 
        }
    );
};

module.exports = generateToken; 