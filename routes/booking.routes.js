const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth');
const { validateRequiredFields, sanitizeFields } = require('../middleware/validator');

/**
 * Booking Routes
 * Base path: /api/bookings
 * All routes require authentication
 */

// Create new booking
router.post(
    '/',
    authenticateToken,
    sanitizeFields(['serviceType', 'vehicleMake', 'vehicleModel', 'location', 'notes']),
    validateRequiredFields(['serviceType', 'vehicleMake', 'vehicleModel', 'location', 'date', 'time', 'price']),
    bookingController.createBooking
);

// Get all user bookings
router.get('/', authenticateToken, bookingController.getUserBookings);

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
