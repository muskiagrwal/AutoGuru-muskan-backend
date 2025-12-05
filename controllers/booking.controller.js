const Booking = require('../models/Booking');
const logger = require('../utils/logger');

/**
 * Booking Controller
 * Handles all booking-related business logic
 */

/**
 * Create New Booking
 * @route POST /api/bookings
 */
const createBooking = async (req, res) => {
    const { serviceType, vehicleMake, vehicleModel, location, date, time, price, notes } = req.body;

    // Validation
    if (!serviceType || !vehicleMake || !vehicleModel || !location || !date || !time || !price) {
        return res.status(400).json({
            success: false,
            message: 'All required fields must be provided'
        });
    }

    try {
        // Create new booking
        const newBooking = new Booking({
            userId: req.user.userId,
            serviceType,
            vehicleMake,
            vehicleModel,
            location,
            date,
            time,
            price,
            notes: notes || '',
            status: 'Pending'
        });

        // Save to database
        await newBooking.save();

        logger.success(`New booking created for user: ${req.user.userId}`);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        logger.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
};

/**
 * Get All User Bookings
 * @route GET /api/bookings
 */
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.userId })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            bookings: bookings
        });
    } catch (error) {
        logger.error('Fetch bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
};

/**
 * Get Specific Booking by ID
 * @route GET /api/bookings/:id
 */
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.userId // Ensure user can only access their own bookings
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            booking: booking
        });
    } catch (error) {
        logger.error('Fetch booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking'
        });
    }
};

/**
 * Update Booking
 * @route PUT /api/bookings/:id
 */
const updateBooking = async (req, res) => {
    const { status, date, time, notes } = req.body;

    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update fields if provided
        if (status) booking.status = status;
        if (date) booking.date = date;
        if (time) booking.time = time;
        if (notes !== undefined) booking.notes = notes;

        await booking.save();

        logger.success(`Booking updated: ${booking._id}`);

        res.json({
            success: true,
            message: 'Booking updated successfully',
            booking: booking
        });
    } catch (error) {
        logger.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking'
        });
    }
};

/**
 * Delete Booking
 * @route DELETE /api/bookings/:id
 */
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        logger.success(`Booking deleted: ${booking._id}`);

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        logger.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    deleteBooking
};
