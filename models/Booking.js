const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mechanicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mechanic'
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    },
    serviceType: {
        type: String,
        required: true,
        trim: true
    },
    vehicleMake: {
        type: String,
        required: true,
        trim: true
    },
    vehicleModel: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    price: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    cancellationReason: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringSchedule: {
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'quarterly', 'yearly']
        },
        nextServiceDate: Date
    },
    cancellationDeadline: {
        type: Date // Calculated based on booking date
    },
    cancellationFee: {
        type: Number,
        default: 0
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
