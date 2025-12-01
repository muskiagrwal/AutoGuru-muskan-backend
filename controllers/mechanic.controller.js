const Mechanic = require('../models/Mechanic');
const Review = require('../models/Review');
const { buildMechanicQuery } = require('../utils/searchHelper');
const { successResponse, errorResponse } = require('../utils/response');

// Register a new mechanic profile
exports.registerMechanic = async (req, res, next) => {
    try {
        const existingMechanic = await Mechanic.findOne({ userId: req.user.id });
        if (existingMechanic) {
            return errorResponse(res, 'Mechanic profile already exists for this user', 400);
        }

        const mechanic = await Mechanic.create({
            userId: req.user.id,
            ...req.body
        });

        return successResponse(res, mechanic, 'Mechanic profile created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Get all mechanics with filtering
exports.getAllMechanics = async (req, res, next) => {
    try {
        const query = buildMechanicQuery(req.query);

        // Geo-spatial search if coordinates provided
        if (req.query.lat && req.query.lng) {
            const lat = parseFloat(req.query.lat);
            const lng = parseFloat(req.query.lng);
            const radius = parseFloat(req.query.radius) || 10; // Default 10km radius

            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            };
        }

        const mechanics = await Mechanic.find(query)
            .populate('userId', 'firstName lastName email')
            .limit(50); // Limit results for performance

        return successResponse(res, mechanics, 'Mechanics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get mechanic by ID
exports.getMechanicById = async (req, res, next) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id)
            .populate('userId', 'firstName lastName email');

        if (!mechanic) {
            return errorResponse(res, 'Mechanic not found', 404);
        }

        return successResponse(res, mechanic, 'Mechanic details retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Update mechanic profile
exports.updateMechanic = async (req, res, next) => {
    try {
        let mechanic = await Mechanic.findById(req.params.id);

        if (!mechanic) {
            return errorResponse(res, 'Mechanic not found', 404);
        }

        // Ensure user owns this mechanic profile
        if (mechanic.userId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to update this profile', 403);
        }

        mechanic = await Mechanic.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return successResponse(res, mechanic, 'Mechanic profile updated successfully');
    } catch (error) {
        next(error);
    }
};

// Get reviews for a mechanic
exports.getMechanicReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ mechanicId: req.params.id })
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });

        return successResponse(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
        next(error);
    }
};
