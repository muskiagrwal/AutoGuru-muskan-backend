const ServiceInterval = require('../models/ServiceInterval');
const VehicleModel = require('../models/VehicleModel');
const response = require('../utils/response');


// POST → Create new service interval
exports.createInterval = async (req, res) => {
    try {
        const { vehicleModel, distance, timeInMonths, price } = req.body;

        // Validate vehicle model exists
        const modelExists = await VehicleModel.findById(vehicleModel);
        if (!modelExists) {
            return response.sendError(res, 404, 'Vehicle model not found');
        }

        // Check duplicate interval for same model
        const existing = await ServiceInterval.findOne({
            vehicleModel,
            distance,
            timeInMonths
        });

        if (existing) {
            return response.sendError(res, 400, 'Service interval already exists for this model');
        }

        const interval = await ServiceInterval.create({
            vehicleModel,
            distance,
            timeInMonths,
            price
        });

        // Populate model + brand for response
        await interval.populate({
            path: 'vehicleModel',
            select: 'name brand',
            populate: { path: 'brand', select: 'name' }
        });

        response.sendCreated(res, 'Service interval created successfully', { interval });
    } catch (error) {
        console.error('Create interval error:', error);
        response.sendError(res, 500, 'Server error while creating service interval');
    }
};


// GET → Fetch all service intervals
exports.getAllIntervals = async (req, res) => {
    try {
        const { vehicleModel, minDistance, maxDistance } = req.query;
        let filter = {};

        // Filter by model
        if (vehicleModel) filter.vehicleModel = vehicleModel;

        // Filter by distance range
        if (minDistance || maxDistance) {
            filter.distance = {};
            if (minDistance) filter.distance.$gte = Number(minDistance);
            if (maxDistance) filter.distance.$lte = Number(maxDistance);
        }

        const intervals = await ServiceInterval.find(filter)
            .populate({
                path: 'vehicleModel',
                select: 'name imageUrl brand',
                populate: { path: 'brand', select: 'name' }
            })
            .sort({ distance: 1 });

        response.sendSuccess(res, 200, 'Service intervals fetched successfully', {
            intervals,
            count: intervals.length
        });
    } catch (error) {
        console.error('Get intervals error:', error);
        response.sendError(res, 500, 'Server error while fetching service intervals');
    }
};


//GET → Get service intervals by vehicle model
exports.getIntervalsByModel = async (req, res) => {
    try {
        const { modelId } = req.params;

        // Validate model
        const modelExists = await VehicleModel.findById(modelId);
        if (!modelExists) {
            return response.sendNotFound(res, 'Vehicle model not found');
        }

        const intervals = await ServiceInterval.find({ vehicleModel: modelId })
            .populate({
                path: 'vehicleModel',
                select: 'name brand',
                populate: { path: 'brand', select: 'name' }
            })
            .sort({ distance: 1 });

        response.sendSuccess(res, 200, 'Service intervals fetched successfully', {
            intervals,
            count: intervals.length,
            model: modelExists.name
        });
    } catch (error) {
        console.error('Get intervals by model error:', error);
        response.sendError(res, 500, 'Server error while fetching service intervals');
    }
};

//GET → Get single service interval by ID
exports.getIntervalById = async (req, res) => {
    try {
        const interval = await ServiceInterval.findById(req.params.id)
            .populate({
                path: 'vehicleModel',
                select: 'name description imageUrl brand',
                populate: { path: 'brand', select: 'name description' }
            });

        if (!interval) {
            return response.sendNotFound(res, 'Service interval not found');
        }

        response.sendSuccess(res, 200, 'Service interval fetched successfully', { interval });
    } catch (error) {
        console.error('Get interval error:', error);
        response.sendError(res, 500, 'Server error while fetching service interval');
    }
};

//PUT → Update service interval
exports.updateInterval = async (req, res) => {
    try {
        const { vehicleModel, distance, timeInMonths, price } = req.body;

        const interval = await ServiceInterval.findById(req.params.id);
        if (!interval) {
            return response.sendNotFound(res, 'Service interval not found');
        }

        // Validate model if updated
        if (vehicleModel) {
            const modelExists = await VehicleModel.findById(vehicleModel);
            if (!modelExists) {
                return response.sendError(res, 404, 'Vehicle model not found');
            }
        }

        // Check duplicate combination except itself
        const modelId = vehicleModel || interval.vehicleModel;
        const newDist = distance ?? interval.distance;
        const newTime = timeInMonths ?? interval.timeInMonths;

        const duplicate = await ServiceInterval.findOne({
            _id: { $ne: interval._id },
            vehicleModel: modelId,
            distance: newDist,
            timeInMonths: newTime
        });

        if (duplicate) {
            return response.sendError(res, 400, 'Service interval already exists for this combination');
        }

        // Update fields
        interval.vehicleModel = modelId;
        interval.distance = newDist;
        interval.timeInMonths = newTime;
        interval.price = price ?? interval.price;

        await interval.save();

        await interval.populate({
            path: 'vehicleModel',
            select: 'name brand',
            populate: { path: 'brand', select: 'name' }
        });

        response.sendSuccess(res, 200, 'Service interval updated successfully', { interval });
    } catch (error) {
        console.error('Update interval error:', error);
        response.sendError(res, 500, 'Server error while updating service interval');
    }
};

//DELETE → Remove service interval
exports.deleteInterval = async (req, res) => {
    try {
        const interval = await ServiceInterval.findById(req.params.id);

        if (!interval) {
            return response.sendNotFound(res, 'Service interval not found');
        }

        await interval.deleteOne();
        response.sendSuccess(res, 200, 'Service interval deleted successfully');
    } catch (error) {
        console.error('Delete interval error:', error);
        response.sendError(res, 500, 'Server error while deleting service interval');
    }
};
