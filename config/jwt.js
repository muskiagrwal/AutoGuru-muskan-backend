const jwt = require('jsonwebtoken');

/**
 * JWT Configuration Module
 * Handles JWT token generation and verification
 */

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

/**
 * Generate JWT token for a user
 * @param {string} userId - User's MongoDB ID
 * @param {string} email - User's email address
 * @param {string} role - User's role (user, admin, supplier)
 * @returns {string} JWT token
 */
const generateToken = (userId, email, role = 'user') => {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Get JWT configuration
 * @returns {object} JWT configuration object
 */
const getJWTConfig = () => {
    return {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN
    };
};

module.exports = {
    generateToken,
    verifyToken,
    getJWTConfig
};
