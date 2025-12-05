const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One mechanic profile per user account
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    abn: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        suburb: String,
        state: String,
        postcode: String,
        country: { type: String, default: 'Australia' }
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    servicesOffered: [{
        type: String,
        trim: true
        // Examples: 'Logbook Service', 'Basic Service', 'Brake Repairs', 'Suspension', 'Tyres', 'Air Conditioning', 'Diagnostics'
    }],
    operatingHours: {
        monday: { open: String, close: String, closed: Boolean },
        tuesday: { open: String, close: String, closed: Boolean },
        wednesday: { open: String, close: String, closed: Boolean },
        thursday: { open: String, close: String, closed: Boolean },
        friday: { open: String, close: String, closed: Boolean },
        saturday: { open: String, close: String, closed: Boolean },
        sunday: { open: String, close: String, closed: Boolean }
    },
    images: [String],
    isVerified: {
        type: Boolean,
        default: false
    },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    priceRange: {
        type: String,
        enum: ['budget', 'standard', 'premium'],
        default: 'standard'
    },
    responseTime: {
        type: Number, // Average response time in hours
        default: 24
    },
    availableTimeSlots: [{
        day: String, // e.g., 'monday', 'tuesday'
        slots: [String] // e.g., ['09:00', '10:00', '11:00']
    }]
}, {
    timestamps: true
});

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

module.exports = Mechanic;
