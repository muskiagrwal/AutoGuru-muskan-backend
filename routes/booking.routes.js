const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth');
const { validate, sanitizeFields } = require('../middleware/validator');
const { bookingSchema } = require('../middleware/validationSchemas');

/**
 * Booking Routes
 * Base path: /api/bookings
 * All routes require authentication
 */

// All routes require authentication
router.use(authenticateToken);

// Create new booking
router.post(
    '/',
    bookingSchema,
    validate,
    bookingController.createBooking
);

// Get all user bookings
router.get('/', bookingController.getUserBookings);

// Get specific booking by ID
router.get('/:id', authenticateToken, bookingController.getBookingById);

// Update booking
router.put(
    '/:id',
    authenticateToken,
    sanitizeFields(['notes']),
    bookingController.updateBooking
);

// Delete booking
router.delete('/:id', authenticateToken, bookingController.deleteBooking);

module.exports = router;
