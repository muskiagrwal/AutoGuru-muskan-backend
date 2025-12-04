const VehicleModel = require('../models/VehicleModel');
const VehicleBrand = require('../models/VehicleBrand');
const response = require('../utils/response');
const { uploadToCloudinary } = require('../config/uploadToCloudinary');

//POST-> Create the vehicle models
exports.createModel = async (req, res) => {
    try {
        const { brand, name, description, rating, quotesProvided, expertMechanics } = req.body;

        const brandExists = await VehicleBrand.findById(brand);
        if (!brandExists) {
            return response.sendError(res, 404, 'Brand not found');
        }

        const existingModel = await VehicleModel.findOne({ brand, name });
        if (existingModel) {
            return response.sendError(res, 400, 'Model with this name already exists for this brand');
        }

        // Handle Image Upload 
        let finalImageUrl = null; 

        if (req.file) {
            try {
                const uploadResult = await uploadToCloudinary(req.file.buffer);
                finalImageUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return response.sendError(res, 500, 'Image upload failed');
            }
        } else if (req.body.imageUrl) {
            //If user sends a URL string instead of a file
            finalImageUrl = req.body.imageUrl;
        }

        // 5. Create the Model in Database
        const model = await VehicleModel.create({
            brand,
            name,
            imageUrl: finalImageUrl, 
            description: description || '',
            rating: rating || 4.5,
            quotesProvided: quotesProvided || false,
            expertMechanics: expertMechanics || 0
        });

        await model.populate('brand', 'name');

        response.sendCreated(res, 'Model created successfully', { model });

    } catch (error) {
        console.error('Create model error:', error);
        response.sendError(res, 500, 'Server error while creating model');
    }
};

//GET-> all models
exports.getAllModels = async (req, res) => {
    try {
        const { brand, search } = req.query;
        
        let filter = {};
        
        // Filter by brand if provided
        if (brand) {
            filter.brand = brand;
        }
        
        // Search by model name
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        
        const models = await VehicleModel.find(filter)
            .populate('brand', 'name')
            .sort({ name: 1 });
            
        response.sendSuccess(res, 200, 'Models fetched successfully', { 
            models, 
            count: models.length 
        });
    } catch (error) {
        console.error('Get models error:', error);
        response.sendError(res, 500, 'Server error while fetching models');
    }
};


//GET-> models by brand
exports.getModelsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        
        // Validate brand exists
        const brandExists = await VehicleBrand.findById(brandId);
        if (!brandExists) {
            return response.sendNotFound(res, 'Brand not found');
        }
        
        const models = await VehicleModel.find({ brand: brandId })
            .populate('brand', 'name')
            .sort({ name: 1 });
            
        response.sendSuccess(res, 200, 'Models fetched successfully', { 
            models, 
            count: models.length,
            brand: brandExists.name 
        });
    } catch (error) {
        console.error('Get models by brand error:', error);
        response.sendError(res, 500, 'Server error while fetching models');
    }
};

//GET->  Get single vehicle model
exports.getModelById = async (req, res) => {
    try {
        const model = await VehicleModel.findById(req.params.id)
            .populate('brand', 'name description');
        
        if (!model) {
            return response.sendNotFound(res, 'Model not found');
        }

        response.sendSuccess(res, 200, 'Model fetched successfully', { model });
    } catch (error) {
        console.error('Get model error:', error);
        response.sendError(res, 500, 'Server error while fetching model');
    }
};

// PUT->Update vehicle model
exports.updateModel = async (req, res) => {
    try {
        const { brand, name, imageUrl, description, rating, quotesProvided, expertMechanics } = req.body;
        
        const model = await VehicleModel.findById(req.params.id);
        
        if (!model) {
            return response.sendNotFound(res, 'Model not found');
        }

        // Validate brand exists if being updated
        if (brand) {
            const brandExists = await VehicleBrand.findById(brand);
            if (!brandExists) {
                return response.sendError(res, 404, 'Brand not found');
            }
        }

        // Check if new name already exists for this brand
        if (name && name !== model.name) {
            const brandId = brand || model.brand;
            const existingModel = await VehicleModel.findOne({ 
                brand: brandId, 
                name 
            });
            if (existingModel) {
                return response.sendError(res, 400, 'Model with this name already exists for this brand');
            }
        }

        // Handle Image Logic 
        let finalImageUrl = model.imageUrl; // Default to existing image

        // Case A: User uploaded a new file
        if (req.file) {
            try {
                const uploadResult = await uploadToCloudinary(req.file.buffer);
                finalImageUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary update upload error:', uploadError);
                return response.sendError(res, 500, 'Image upload failed');
            }
        } 
        // Case B: User sent a text URL (and no file)
        else if (imageUrl) {
            finalImageUrl = imageUrl;
        }

        //  Update fields
        model.brand = brand || model.brand;
        model.name = name || model.name;
        model.imageUrl = finalImageUrl; 
        model.description = description !== undefined ? description : model.description;
        model.rating = rating !== undefined ? rating : model.rating;
        model.quotesProvided = quotesProvided !== undefined ? quotesProvided : model.quotesProvided;
        model.expertMechanics = expertMechanics !== undefined ? expertMechanics : model.expertMechanics;

        await model.save();
        await model.populate('brand', 'name');

        response.sendSuccess(res, 200, 'Model updated successfully', { model });

    } catch (error) {
        console.error('Update model error:', error);
        response.sendError(res, 500, 'Server error while updating model');
    }
};

//DELETE-> vehicle model delete
exports.deleteModel = async (req, res) => {
    try {
        const model = await VehicleModel.findById(req.params.id);
        
        if (!model) {
            return response.sendNotFound(res, 'Model not found');
        }


        await model.deleteOne();

        response.sendSuccess(res, 200, 'Model deleted successfully');
    } catch (error) {
        console.error('Delete model error:', error);
        response.sendError(res, 500, 'Server error while deleting model');
    }
};

