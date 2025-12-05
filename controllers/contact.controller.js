const Contact = require('../models/Contact');
const logger = require('../utils/logger');

/**
 * Contact Controller
 * Handles all contact form submission business logic
 */

/**
 * Submit Contact Form
 * @route POST /api/contact
 */
const submitContact = async (req, res) => {
    const { name, email, phone, make, service, message } = req.body;

    // Validation - only name, email, and phone are required
    if (!name || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and phone are required'
        });
    }

    try {
        // Create new contact submission
        const newContact = new Contact({
            name,
            email,
            phone,
            make: make || '',
            service: service || '',
            message: message || '',
            status: 'New'
        });

        // Save to database
        await newContact.save();

        logger.success(`New contact submission received from: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you shortly.',
            contact: {
                id: newContact._id,
                name: newContact.name,
                email: newContact.email,
                createdAt: newContact.createdAt
            }
        });
    } catch (error) {
        logger.error('Submit contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form'
        });
    }
};

/**
 * Get All Contact Submissions
 * @route GET /api/contact
 */
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            contacts: contacts
        });
    } catch (error) {
        logger.error('Fetch contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact submissions'
        });
    }
};

/**
 * Get Specific Contact by ID
 * @route GET /api/contact/:id
 */
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.json({
            success: true,
            contact: contact
        });
    } catch (error) {
        logger.error('Fetch contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact submission'
        });
    }
};

/**
 * Update Contact Status
 * @route PUT /api/contact/:id
 */
const updateContact = async (req, res) => {
    const { status } = req.body;

    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        // Update status if provided
        if (status) contact.status = status;

        await contact.save();

        logger.success(`Contact submission updated: ${contact._id}`);

        res.json({
            success: true,
            message: 'Contact submission updated successfully',
            contact: contact
        });
    } catch (error) {
        logger.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact submission'
        });
    }
};

/**
 * Delete Contact Submission
 * @route DELETE /api/contact/:id
 */
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        logger.success(`Contact submission deleted: ${contact._id}`);

        res.json({
            success: true,
            message: 'Contact submission deleted successfully'
        });
    } catch (error) {
        logger.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact submission'
        });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
};
