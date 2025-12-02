const Vehicle = require('../models/Vehicle');
const { successResponse, errorResponse } = require('../utils/response');

// Add a new vehicle
exports.addVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create({
            userId: req.user.id,
            ...req.body
        });

        return successResponse(res, vehicle, 'Vehicle added successfully', 201);
    } catch (error) {
        // Handle duplicate registration error
        if (error.code === 11000) {
            return errorResponse(res, 'Vehicle with this registration already exists for your account', 400);
        }
        next(error);
    }
};

// Get all vehicles for logged-in user
exports.getUserVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        return successResponse(res, vehicles, 'Vehicles retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return errorResponse(res, 'Vehicle not found', 404);
        }

        if (vehicle.userId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to view this vehicle', 403);
        }

        return successResponse(res, vehicle, 'Vehicle details retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Update vehicle
exports.updateVehicle = async (req, res, next) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return errorResponse(res, 'Vehicle not found', 404);
        }

        if (vehicle.userId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to update this vehicle', 403);
        }

        vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return successResponse(res, vehicle, 'Vehicle updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete vehicle
exports.deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return errorResponse(res, 'Vehicle not found', 404);
        }

        if (vehicle.userId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to delete this vehicle', 403);
        }

        await vehicle.deleteOne();

        return successResponse(res, null, 'Vehicle deleted successfully');
    } catch (error) {
        next(error);
    }
};
