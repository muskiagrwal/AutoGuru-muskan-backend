const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    variant: {
        type: String,
        trim: true
    },
    registration: {
        type: String,
        trim: true,
        uppercase: true
    },
    vin: {
        type: String,
        trim: true,
        uppercase: true
    },
    lastServiceDate: {
        type: Date
    },
    lastServiceMileage: {
        type: Number
    }
}, {
    timestamps: true
});

// Compound index to ensure a user doesn't duplicate the exact same vehicle accidentally
vehicleSchema.index({ userId: 1, registration: 1 }, { unique: true, sparse: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
