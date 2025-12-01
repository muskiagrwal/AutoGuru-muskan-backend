const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
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
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    serviceType: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Quoted', 'Accepted', 'Rejected', 'Expired'],
        default: 'Pending'
    },
    quotedPrice: {
        amount: Number,
        currency: { type: String, default: 'AUD' }
    },
    estimatedDuration: {
        type: String // e.g., "2 hours", "1 day"
    },
    validUntil: {
        type: Date
    },
    mechanicNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
