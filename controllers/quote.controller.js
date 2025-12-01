const Quote = require('../models/Quote');
const Mechanic = require('../models/Mechanic');
const Booking = require('../models/Booking');
const { successResponse, errorResponse } = require('../utils/response');

// User requests a quote
exports.requestQuote = async (req, res, next) => {
    try {
        const { mechanicId, vehicleId, serviceType, description } = req.body;

        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic) {
            return errorResponse(res, 'Mechanic not found', 404);
        }

        const quote = await Quote.create({
            userId: req.user.id,
            mechanicId,
            vehicleId,
            serviceType,
            description,
            status: 'Pending'
        });

        return successResponse(res, quote, 'Quote requested successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Get quotes for logged-in user
exports.getUserQuotes = async (req, res, next) => {
    try {
        const quotes = await Quote.find({ userId: req.user.id })
            .populate('mechanicId', 'businessName')
            .populate('vehicleId', 'make model year')
            .sort({ createdAt: -1 });

        return successResponse(res, quotes, 'User quotes retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get quotes for logged-in mechanic
exports.getMechanicQuotes = async (req, res, next) => {
    try {
        // Find mechanic profile for this user
        const mechanic = await Mechanic.findOne({ userId: req.user.id });
        if (!mechanic) {
            return errorResponse(res, 'Mechanic profile not found', 404);
        }

        const quotes = await Quote.find({ mechanicId: mechanic._id })
            .populate('userId', 'firstName lastName email')
            .populate('vehicleId', 'make model year')
            .sort({ createdAt: -1 });

        return successResponse(res, quotes, 'Mechanic quotes retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Mechanic responds to quote
exports.respondToQuote = async (req, res, next) => {
    try {
        const { amount, estimatedDuration, validUntil, mechanicNotes } = req.body;

        let quote = await Quote.findById(req.params.id);
        if (!quote) {
            return errorResponse(res, 'Quote not found', 404);
        }

        // Verify ownership (mechanic check)
        const mechanic = await Mechanic.findOne({ userId: req.user.id });
        if (!mechanic || quote.mechanicId.toString() !== mechanic._id.toString()) {
            return errorResponse(res, 'Not authorized to respond to this quote', 403);
        }

        quote = await Quote.findByIdAndUpdate(req.params.id, {
            status: 'Quoted',
            quotedPrice: { amount },
            estimatedDuration,
            validUntil,
            mechanicNotes
        }, { new: true });

        return successResponse(res, quote, 'Quote responded successfully');
    } catch (error) {
        next(error);
    }
};

// User accepts quote (creates booking)
exports.acceptQuote = async (req, res, next) => {
    try {
        let quote = await Quote.findById(req.params.id)
            .populate('mechanicId')
            .populate('vehicleId');

        if (!quote) {
            return errorResponse(res, 'Quote not found', 404);
        }

        if (quote.userId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to accept this quote', 403);
        }

        if (quote.status !== 'Quoted') {
            return errorResponse(res, 'Quote cannot be accepted in its current status', 400);
        }

        // Create booking from quote
        const booking = await Booking.create({
            userId: req.user.id,
            mechanicId: quote.mechanicId._id,
            vehicleId: quote.vehicleId ? quote.vehicleId._id : undefined,
            quoteId: quote._id,
            serviceType: quote.serviceType,
            vehicleMake: quote.vehicleId ? quote.vehicleId.make : 'Unknown',
            vehicleModel: quote.vehicleId ? quote.vehicleId.model : 'Unknown',
            location: quote.mechanicId.address ? `${quote.mechanicId.address.street}, ${quote.mechanicId.address.suburb}` : 'Mechanic Workshop',
            date: req.body.date || new Date().toISOString().split('T')[0], // Default to today if not provided
            time: req.body.time || '09:00',
            price: quote.quotedPrice.amount.toString(),
            status: 'Confirmed',
            notes: `Booking created from quote. ${quote.description || ''}`
        });

        // Update quote status
        quote.status = 'Accepted';
        await quote.save();

        return successResponse(res, { booking, quote }, 'Quote accepted and booking created');
    } catch (error) {
        next(error);
    }
};

// Reject quote
exports.rejectQuote = async (req, res, next) => {
    try {
        let quote = await Quote.findById(req.params.id);

        if (!quote) {
            return errorResponse(res, 'Quote not found', 404);
        }

        // Allow both user and mechanic to reject/cancel
        const isUser = quote.userId.toString() === req.user.id;
        const mechanic = await Mechanic.findOne({ userId: req.user.id });
        const isMechanic = mechanic && quote.mechanicId.toString() === mechanic._id.toString();

        if (!isUser && !isMechanic) {
            return errorResponse(res, 'Not authorized', 403);
        }

        quote.status = 'Rejected';
        await quote.save();

        return successResponse(res, quote, 'Quote rejected');
    } catch (error) {
        next(error);
    }
};
