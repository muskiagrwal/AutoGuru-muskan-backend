const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
<<<<<<< HEAD
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
=======
>>>>>>> 76d13f74b301aa638e1707c0d66b72f6c24d4e54
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
<<<<<<< HEAD
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
=======
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
>>>>>>> 76d13f74b301aa638e1707c0d66b72f6c24d4e54
        default: 'Pending'
    },
    price: {
        type: String,
        required: true
    },
<<<<<<< HEAD
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    cancellationReason: {
        type: String,
        trim: true
    },
=======
>>>>>>> 76d13f74b301aa638e1707c0d66b72f6c24d4e54
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
