/**
 * Request Validation Middleware
 * Provides utilities for validating request data
 */

/**
 * Validate required fields in request body
 * @param {Array<string>} fields - Array of required field names
 * @returns {Function} Express middleware function
 */
const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        const missingFields = [];

        for (const field of fields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        next();
    };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Middleware to validate email in request body
 */
const validateEmail = (req, res, next) => {
    const { email } = req.body;

    if (email && !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
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
    validateRequiredFields,
    validateEmail,
    isValidEmail,
    sanitizeFields
};
