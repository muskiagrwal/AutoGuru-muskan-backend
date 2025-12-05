const { validationResult } = require('express-validator');

/**
 * Request Validation Middleware
 * Provides utilities for validating request data
 */

/**
 * Middleware to check validation results from express-validator
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg, // Return the first error message
            errors: errors.array()
        });
    }
    next();
};

/**
 * Sanitize user input by trimming whitespace
 * @param {Array<string>} fields - Fields to sanitize
 * @returns {Function} Express middleware function
 */
const sanitizeFields = (fields) => {
    return (req, res, next) => {
        for (const field of fields) {
            if (req.body[field] && typeof req.body[field] === 'string') {
                req.body[field] = req.body[field].trim();
            }
        }
        next();
    };
};

module.exports = {
    validate,
    sanitizeFields
};

