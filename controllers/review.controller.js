const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Mechanic = require('../models/Mechanic');
const { successResponse, errorResponse } = require('../utils/response');

// Create a review
exports.createReview = async (req, res, next) => {
    try {
        const { bookingId, rating, comment } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return errorResponse(res, 'Booking not found', 404);
        }

        // Verify user owns the booking
        if (booking.userId.toString() !== req.user.id) {
            return errorResponse(res, 'Not authorized to review this booking', 403);
        }

        // Verify booking is completed
        if (booking.status !== 'Completed') {
            return errorResponse(res, 'Can only review completed bookings', 400);
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return errorResponse(res, 'Review already exists for this booking', 400);
        }

        const review = await Review.create({
            userId: req.user.id,
            mechanicId: booking.mechanicId,
            bookingId,
            rating,
            comment
        });

        // Update mechanic's average rating
        await updateMechanicRating(booking.mechanicId);

        return successResponse(res, review, 'Review created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Get reviews for a mechanic
exports.getReviewsByMechanic = async (req, res, next) => {
    try {
        const reviews = await Review.find({ mechanicId: req.params.mechanicId })
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });

        return successResponse(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Get reviews by logged-in user
exports.getUserReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ userId: req.user.id })
            .populate('mechanicId', 'businessName')
            .sort({ createdAt: -1 });

        return successResponse(res, reviews, 'User reviews retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Mechanic responds to review
exports.mechanicResponse = async (req, res, next) => {
    try {
        const { response } = req.body;

        let review = await Review.findById(req.params.id);
        if (!review) {
            return errorResponse(res, 'Review not found', 404);
        }

        // Verify mechanic owns the reviewed service
        const mechanic = await Mechanic.findOne({ userId: req.user.id });
        if (!mechanic || review.mechanicId.toString() !== mechanic._id.toString()) {
            return errorResponse(res, 'Not authorized to respond to this review', 403);
        }

        review.mechanicResponse = response;
        await review.save();

        return successResponse(res, review, 'Response added successfully');
    } catch (error) {
        next(error);
    }
};

// Helper to update mechanic rating
const updateMechanicRating = async (mechanicId) => {
    const stats = await Review.aggregate([
        { $match: { mechanicId: mechanicId } },
        {
            $group: {
                _id: '$mechanicId',
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Mechanic.findByIdAndUpdate(mechanicId, {
            rating: {
                average: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
                count: stats[0].count
            }
        });
    }
};

// Vote review as helpful
exports.voteHelpful = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return errorResponse(res, 'Review not found', 404);
        }

        // Increment helpful votes
        review.helpfulVotes += 1;
        await review.save();

        return successResponse(res, review, 'Vote recorded successfully');
    } catch (error) {
        next(error);
    }
};
