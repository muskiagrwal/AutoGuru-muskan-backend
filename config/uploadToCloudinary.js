
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'autoguru/vehicle_models', 
                allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};