/**
 * Global Error Handler Middleware
 * Catches and formats all errors in a consistent way
 */

const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);

    // Default error status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Prepare error response
    const errorResponse = {
        success: false,
        message: message
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.error = err;
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * Handles requests to undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFoundHandler
};
