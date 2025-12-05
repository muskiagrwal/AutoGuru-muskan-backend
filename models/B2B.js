const mongoose = require('mongoose');

const b2bSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    abn: {
        type: String,
        required: true,
        trim: true
    },
    contactName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
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
    serviceTypes: {
        type: [String],
        default: []
    },
    documents: {
        registration: {
            name: String,
            base64: String
        },
        insurance: {
            name: String,
            base64: String
        },
        workersComp: {
            name: String,
            base64: String
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const B2B = mongoose.model('B2B', b2bSchema);

module.exports = B2B;
