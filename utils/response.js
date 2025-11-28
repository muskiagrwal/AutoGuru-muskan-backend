/**
 * Response Utility
 * Provides consistent response formatting
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
    res.status(statusCode).json({
        success: true,
        message,
        ...data
    });
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errors - Additional error details
 */
const sendError = (res, statusCode = 500, message = 'Error', errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 */
const sendCreated = (res, message = 'Resource created successfully', data = {}) => {
    sendSuccess(res, 201, message, data);
};

/**
 * Send not found response (404)
 */
const sendNotFound = (res, message = 'Resource not found') => {
    sendError(res, 404, message);
};

/**
 * Send unauthorized response (401)
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
    sendError(res, 401, message);
};

/**
 * Send forbidden response (403)
 */
const sendForbidden = (res, message = 'Forbidden') => {
    sendError(res, 403, message);
};

/**
 * Send bad request response (400)
 */
const sendBadRequest = (res, message = 'Bad request', errors = null) => {
    sendError(res, 400, message, errors);
};

module.exports = {
    sendSuccess,
    sendError,
    sendCreated,
    sendNotFound,
    sendUnauthorized,
    sendForbidden,
    sendBadRequest
};
