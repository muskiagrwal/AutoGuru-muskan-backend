const B2B = require('../models/B2B');
const logger = require('../utils/logger');

/**
 * B2B Controller
 * Handles all B2B business partnership registration and management logic
 */

/**
 * Register B2B Business
 * @route POST /api/b2b/register
 */
const registerB2B = async (req, res) => {
    const { businessName, abn, contactName, email, phone, address, serviceTypes, documents } = req.body;

    // Validation - Required fields
    if (!businessName || !abn || !contactName || !email || !phone || !address) {
        return res.status(400).json({
            success: false,
            message: 'Business name, ABN, contact name, email, phone, and address are required'
        });
    }

    try {
        // Create new B2B proposal
        const newB2B = new B2B({
            businessName,
            abn,
            contactName,
            email,
            phone,
            address,
            serviceTypes: serviceTypes || [],
            documents: documents || {},
            status: 'pending'
        });

        // Save to database
        await newB2B.save();

        logger.success(`New B2B proposal received from: ${businessName} (${email})`);

        res.status(201).json({
            success: true,
            message: 'Thank you for your application! Our team will review your proposal and contact you within 24-48 hours.',
            proposal: {
                id: newB2B._id,
                businessName: newB2B.businessName,
                email: newB2B.email,
                status: newB2B.status,
                createdAt: newB2B.createdAt
            }
        });
    } catch (error) {
        logger.error('B2B registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting B2B application'
        });
    }
};

/**
 * Get All B2B Proposals
 * @route GET /api/b2b
 */
const getAllB2BProposals = async (req, res) => {
    try {
        const proposals = await B2B.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .select('-documents.registration.base64 -documents.insurance.base64 -documents.workersComp.base64'); // Exclude base64 data for list view

        res.json({
            success: true,
            count: proposals.length,
            proposals: proposals
        });
    } catch (error) {
        logger.error('Fetch B2B proposals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching B2B proposals'
        });
    }
};

/**
 * Get Specific B2B Proposal by ID
 * @route GET /api/b2b/:id
 */
const getB2BProposalById = async (req, res) => {
    try {
        const proposal = await B2B.findById(req.params.id);

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: 'B2B proposal not found'
            });
        }

        res.json({
            success: true,
            proposal: proposal
        });
    } catch (error) {
        logger.error('Fetch B2B proposal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching B2B proposal'
        });
    }
};

/**
 * Update B2B Proposal Status
 * @route PUT /api/b2b/:id/status
 */
const updateB2BStatus = async (req, res) => {
    const { status } = req.body;

    // Validate status
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be: pending, approved, or rejected'
        });
    }

    try {
        const proposal = await B2B.findById(req.params.id);

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: 'B2B proposal not found'
            });
        }

        // Update status
        proposal.status = status;
        await proposal.save();

        logger.success(`B2B proposal status updated to ${status}: ${proposal._id}`);

        res.json({
            success: true,
            message: `B2B proposal status updated to ${status}`,
            proposal: {
                id: proposal._id,
                businessName: proposal.businessName,
                status: proposal.status,
                updatedAt: proposal.updatedAt
            }
        });
    } catch (error) {
        logger.error('Update B2B status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating B2B proposal status'
        });
    }
};

/**
 * Delete B2B Proposal
 * @route DELETE /api/b2b/:id
 */
const deleteB2BProposal = async (req, res) => {
    try {
        const proposal = await B2B.findByIdAndDelete(req.params.id);

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: 'B2B proposal not found'
            });
        }

        logger.success(`B2B proposal deleted: ${proposal._id}`);

        res.json({
            success: true,
            message: 'B2B proposal deleted successfully'
        });
    } catch (error) {
        logger.error('Delete B2B proposal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting B2B proposal'
        });
    }
};

module.exports = {
    registerB2B,
    getAllB2BProposals,
    getB2BProposalById,
    updateB2BStatus,
    deleteB2BProposal
};
