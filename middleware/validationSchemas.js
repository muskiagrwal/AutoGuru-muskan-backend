const { check } = require('express-validator');

/**
 * Validation Schemas
 * Defines validation rules for various API endpoints
 */

const registerSchema = [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginSchema = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

const forgotPasswordSchema = [
    check('email', 'Please include a valid email').isEmail()
];

const resetPasswordSchema = [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const bookingSchema = [
    check('serviceType', 'Service type is required').not().isEmpty(),
    check('vehicleMake', 'Vehicle make is required').not().isEmpty(),
    check('vehicleModel', 'Vehicle model is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('time', 'Time is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty()
];

const contactSchema = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty()
];

const homeServiceSchema = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('serviceType', 'Service type is required').not().isEmpty(),
    check('vehicleName', 'Vehicle name is required').not().isEmpty(),
    check('vehicleType', 'Vehicle type is required').not().isEmpty(),
    check('vehicleModel', 'Vehicle model is required').not().isEmpty(),
    check('vehicleYear', 'Vehicle year is required').not().isEmpty()
];

const mechanicSignupSchema = [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('businessName', 'Business name is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty()
];

const b2bRegistrationSchema = [
    check('businessName', 'Business name is required').not().isEmpty().isLength({ min: 2 }),
    check('abn', 'ABN is required').not().isEmpty(),
    check('contactName', 'Contact name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('address', 'Business address is required').not().isEmpty()
];

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    bookingSchema,
    contactSchema,
    homeServiceSchema,
    mechanicSignupSchema,
    b2bRegistrationSchema
};
