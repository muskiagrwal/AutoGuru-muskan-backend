const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mechanic',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    mechanicResponse: {
        type: String,
        trim: true
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: true // Since we link to a bookingId, it's verified by default
    }
}, {
    timestamps: true
});

// Prevent multiple reviews for the same booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
