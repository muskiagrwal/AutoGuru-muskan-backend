const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { successResponse, errorResponse } = require('../utils/response');

// Upload single image
exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded', 400);
        }

        // Create a stream from the buffer
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'autoguru/uploads',
                allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return errorResponse(res, 'Image upload failed', 500);
                }

                return successResponse(res, {
                    url: result.secure_url,
                    public_id: result.public_id
                }, 'Image uploaded successfully');
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);

    } catch (error) {
        next(error);
    }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return errorResponse(res, 'No files uploaded', 400);
        }

        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'autoguru/uploads',
                        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            url: result.secure_url,
                            public_id: result.public_id
                        });
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        const results = await Promise.all(uploadPromises);

        return successResponse(res, results, 'Images uploaded successfully');

    } catch (error) {
        console.error('Multiple upload error:', error);
        return errorResponse(res, 'One or more image uploads failed', 500);
    }
};
