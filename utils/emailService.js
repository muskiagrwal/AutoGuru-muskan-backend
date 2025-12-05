const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Email Service
 * Handles sending emails using Nodemailer
 */

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

/**
 * Send Email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 */
const sendEmail = async (to, subject, text, html = null) => {
    try {
        // If no SMTP credentials, just log it (for dev/demo)
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            logger.warn('SMTP credentials not found. Email not sent (simulated).');
            logger.info(`To: ${to}`);
            logger.info(`Subject: ${subject}`);
            return true;
        }

        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME || 'AutoGuru'}" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
            html: html || text // Fallback to text if HTML not provided
        });

        logger.success(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error('Error sending email:', error);
        return false;
    }
};

/**
 * Send SMS (Stub)
 * @param {string} to - Recipient phone number
 * @param {string} message - SMS message
 */
const sendSMS = async (to, message) => {
    try {
        // Placeholder for SMS service (e.g., Twilio)
        logger.info(`[SMS SIMULATION] To: ${to}, Message: ${message}`);
        return true;
    } catch (error) {
        logger.error('Error sending SMS:', error);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendSMS
};
