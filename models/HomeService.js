const mongoose = require('mongoose');

const homeServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    serviceType: {
        type: String,
        required: true,
        trim: true
    },
    vehicleName: {
        type: String,
        required: true,
        trim: true
    },
    vehicleType: {
        type: String,
        required: true,
        trim: true
    },
    vehicleModel: {
        type: String,
        required: true,
        trim: true
    },
    vehicleYear: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const HomeService = mongoose.model('HomeService', homeServiceSchema);

module.exports = HomeService;
