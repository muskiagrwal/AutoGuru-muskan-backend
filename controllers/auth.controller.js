const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 * Handles all authentication-related business logic
 */

/**
 * User Signup
 * @route POST /api/auth/signup
 */
const signup = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "user"
        });

        // Save to database
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id.toString(), newUser.email, newUser.role);

        logger.success(`New user registered: ${newUser.email}`);

        // Return user without password
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            },
            token: token
        });
    } catch (error) {
        logger.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user account'
        });
    }
};

/**
 * User Login
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id.toString(), user.email, user.role);

        logger.success(`User logged in: ${user.email}`);

        // Return user without password
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
            token: token
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login'
        });
    }
};

/**
 * Verify Token
 * @route POST /api/auth/verify
 */
const verify = async (req, res) => {
    try {
        // If middleware passes, token is valid
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Token is valid',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        logger.error('Verify token error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying token'
        });
    }
};

/**
 * Get User Profile
 * @route GET /api/auth/profile
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        logger.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

/**
 * Get All Users (Debug Only - Remove in Production)
 * @route GET /api/auth/users
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

/**
 * Forgot Password
 * @route POST /api/auth/forgotpassword
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and save to DB
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
        // Note: In production, this should link to the frontend, e.g., https://autoguru.com/reset-password/${resetToken}

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: `Your password reset link: ${resetUrl}`,
                html: message
            });

            res.status(200).json({
                success: true,
                message: 'Email sent'
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (error) {
        logger.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending email'
        });
    }
};

/**
 * Reset Password
 * @route PUT /api/auth/resetpassword/:resetToken
 */
const resetPassword = async (req, res) => {
    try {
        // Get token from params and hash it
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        logger.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};

/**
 * Logout
 * @route POST /api/auth/logout
 */
const logout = async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side by removing the token
        // But we can log the event for security monitoring
        logger.info(`User logged out: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};

/**
 * Generate and Send OTP
 * Helper function to generate OTP and save to user
 */
const generateAndSendOtp = async (user, purpose = 'verification') => {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP with 10 minute expiration
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpPurpose = purpose;
    await user.save();

    // Send OTP via email
    const message = `
        <h1>Your OTP Code</h1>
        <p>Your OTP code for ${purpose} is:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
    `;

    await sendEmail({
        to: user.email,
        subject: `Your OTP Code - ${purpose}`,
        text: `Your OTP code is: ${otp}. Valid for 10 minutes.`,
        html: message
    });

    return otp;
};

/**
 * Verify OTP
 * @route POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and OTP are required'
        });
    }

    try {
        const user = await User.findOne({
            email: email.toLowerCase(),
            otp: otp,
            otpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpire = undefined;
        user.otpPurpose = undefined;
        await user.save();

        logger.success(`OTP verified for user: ${user.email}`);

        res.json({
            success: true,
            message: 'OTP verified successfully',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        logger.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP'
        });
    }
};

/**
 * Resend OTP
 * @route POST /api/auth/resend-otp
 */
const resendOtp = async (req, res) => {
    const { email, purpose } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate and send new OTP
        await generateAndSendOtp(user, purpose || 'verification');

        logger.success(`OTP resent to user: ${user.email}`);

        res.json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        logger.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP'
        });
    }
};

/**
 * Update Profile
 * @route POST /api/auth/update-profile
 */
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        await user.save();

        logger.success(`Profile updated for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

/**
 * Update Email
 * @route POST /api/auth/update-email
 */
const updateEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body;

        if (!newEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'New email and password are required'
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Check if new email already exists
        const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        user.email = newEmail.toLowerCase();
        await user.save();

        logger.success(`Email updated for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Email updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        logger.error('Update email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating email'
        });
    }
};

/**
 * Update Password
 * @route POST /api/auth/update-password
 */
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        logger.success(`Password updated for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        logger.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
};

/**
 * Change Password (alias for updatePassword)
 * @route POST /api/auth/change-password
 */
const changePassword = updatePassword;

module.exports = {
    signup,
    login,
    verify,
    getProfile,
    getAllUsers,
    forgotPassword,
    resetPassword,
    logout,
    verifyOtp,
    resendOtp,
    updateProfile,
    updateEmail,
    updatePassword,
    changePassword
};
