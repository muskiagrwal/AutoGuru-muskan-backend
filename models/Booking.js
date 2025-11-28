const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    price: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
