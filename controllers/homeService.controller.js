const HomeService = require('../models/HomeService');
const logger = require('../utils/logger');

/**
 * Home Service Controller
 * Handles all home service booking-related business logic
 */

/**
 * Create New Home Service Booking
 * @route POST /api/home-service
 */
const createHomeService = async (req, res) => {
    const { name, email, phone, address, serviceType, vehicleName, vehicleType, vehicleModel, vehicleYear } = req.body;

    // Validation
    if (!name || !email || !phone || !address || !serviceType || !vehicleName || !vehicleType || !vehicleModel || !vehicleYear) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        // Create new home service booking
        const newHomeService = new HomeService({
            name,
            email,
            phone,
            address,
            serviceType,
            vehicleName,
            vehicleType,
            vehicleModel,
            vehicleYear,
            status: 'Pending'
        });

        // Save to database
        await newHomeService.save();

        logger.success(`New home service booking created: ${newHomeService._id}`);

        res.status(201).json({
            success: true,
            message: 'Home service booking created successfully',
            booking: newHomeService
        });
    } catch (error) {
        logger.error('Create home service error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating home service booking'
        });
    }
};

/**
 * Get All Home Service Bookings
 * @route GET /api/home-service
 */
const getAllHomeServices = async (req, res) => {
    try {
        const homeServices = await HomeService.find()
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            bookings: homeServices
        });
    } catch (error) {
        logger.error('Fetch home services error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching home service bookings'
        });
    }
};

/**
 * Get Specific Home Service Booking by ID
 * @route GET /api/home-service/:id
 */
const getHomeServiceById = async (req, res) => {
    try {
        const homeService = await HomeService.findById(req.params.id);

        if (!homeService) {
            return res.status(404).json({
                success: false,
                message: 'Home service booking not found'
            });
        }

        res.json({
            success: true,
            booking: homeService
        });
    } catch (error) {
        logger.error('Fetch home service error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching home service booking'
        });
    }
};

/**
 * Update Home Service Booking
 * @route PUT /api/home-service/:id
 */
const updateHomeService = async (req, res) => {
    const { status } = req.body;

    try {
        const homeService = await HomeService.findById(req.params.id);

        if (!homeService) {
            return res.status(404).json({
                success: false,
                message: 'Home service booking not found'
            });
        }

        // Update status if provided
        if (status) homeService.status = status;

        await homeService.save();

        logger.success(`Home service booking updated: ${homeService._id}`);

        res.json({
            success: true,
            message: 'Home service booking updated successfully',
            booking: homeService
        });
    } catch (error) {
        logger.error('Update home service error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating home service booking'
        });
    }
};

/**
 * Delete Home Service Booking
 * @route DELETE /api/home-service/:id
 */
const deleteHomeService = async (req, res) => {
    try {
        const homeService = await HomeService.findByIdAndDelete(req.params.id);

        if (!homeService) {
            return res.status(404).json({
                success: false,
                message: 'Home service booking not found'
            });
        }

        logger.success(`Home service booking deleted: ${homeService._id}`);

        res.json({
            success: true,
            message: 'Home service booking cancelled successfully'
        });
    } catch (error) {
        logger.error('Delete home service error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling home service booking'
        });
    }
};

module.exports = {
    createHomeService,
    getAllHomeServices,
    getHomeServiceById,
    updateHomeService,
    deleteHomeService
};
