const { verifyToken } = require('../config/jwt');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */

/**
 * Middleware to authenticate JWT token
 * Expects token in Authorization header as "Bearer <token>"
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }

    // Attach user info to request object
    req.user = decoded;
    next();
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't fail if missing
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }

    next();
};


 // Role-based Authorization Example-> authorizeRoles('admin', 'supplier', 'user')
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to perform this action'
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    optionalAuth,
    authorizeRoles,
    // Alias for consistency with new routes
    protect: authenticateToken
};
