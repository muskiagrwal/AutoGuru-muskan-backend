/**
 * Role-Based Authorization Middleware
 * Checks if authenticated user has required role(s)
 * Must be used AFTER authenticateToken middleware
 */

const logger = require('../utils/logger');

/**
 * Middleware to check if user has one of the required roles
 * @param {string|string[]} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Single role
 * router.get('/admin', authenticateToken, requireRole('admin'), controller.adminFunction);
 * 
 * // Multiple roles
 * router.get('/dashboard', authenticateToken, requireRole(['admin', 'supplier']), controller.dashboard);
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Ensure user is authenticated (should be set by authenticateToken middleware)
        if (!req.user) {
            logger.warn('requireRole middleware called without authentication');
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Convert single role to array for consistency
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${roles.join(', ')}`);
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
                required: roles,
                current: req.user.role
            });
        }

        // User has required role, proceed
        next();
    };
};

/**
 * Shorthand middleware for admin-only routes
 */
const requireAdmin = requireRole('admin');

/**
 * Shorthand middleware for supplier or admin roles
 */
const requireSupplierOrAdmin = requireRole(['supplier', 'admin']);

/**
 * Middleware to check if user is accessing their own resource
 * @param {string} paramName - Name of the URL parameter containing the user ID (default: 'userId')
 */
const requireSelfOrAdmin = (paramName = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const targetUserId = req.params[paramName] || req.body[paramName];

        // Allow if admin OR if accessing own resource
        if (req.user.role === 'admin' || req.user.userId === targetUserId) {
            next();
        } else {
            logger.warn(`User ${req.user.email} attempted to access resource of user ${targetUserId}`);
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own resources.'
            });
        }
    };
};

module.exports = {
    requireRole,
    requireAdmin,
    requireSupplierOrAdmin,
    requireSelfOrAdmin
};
