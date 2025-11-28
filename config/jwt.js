const jwt = require('jsonwebtoken');

/**
 * JWT Configuration Module
 * Handles JWT token generation and verification
 */

const JWT_SECRET = process.env.JWT_SECRET || 'autoguru-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token for a user
 * @param {string} userId - User's MongoDB ID
 * @param {string} email - User's email address
 * @returns {string} JWT token
 */
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
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
