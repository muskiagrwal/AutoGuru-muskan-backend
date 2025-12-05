const Service = require("../models/Service");
const SubService = require("../models/SubService");
const response = require("../utils/response");
const { uploadToCloudinary } = require("../config/uploadToCloudinary");

// POST -> Create Service
exports.createService = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    // Check duplicates
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return response.sendError(
        res,
        400,
        "Service with this name already exists"
      );
    }

    // Handle Image Upload
    let finalImageUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        finalImageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return response.sendError(res, 500, "Image upload failed");
      }
    } else if (req.body.image) {
      finalImageUrl = req.body.image;
    }

    const service = await Service.create({
      name,
      description: description || "",
      image: finalImageUrl,
      isActive: isActive !== undefined ? isActive : true,
      ...req.body,
    });

    response.sendCreated(res, "Service created successfully", { service });
  } catch (error) {
    console.error("Create service error:", error);
    response.sendError(res, 500, "Server error while creating service");
  }
};

// GET -> Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const { search, isActive, includeSubServices } = req.query;

    let filter = {};

    // Filter by active status if provided
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let services;
    if (includeSubServices === 'true') {
      services = await Service.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'subservices',
            localField: '_id',
            foreignField: 'service',
            as: 'subServices'
          }
        },
        { $sort: { name: 1 } }
      ]);
    } else {
      services = await Service.find(filter).sort({ name: 1 });
    }

    response.sendSuccess(res, 200, "Services fetched successfully", {
      services,
      count: services.length,
    });
  } catch (error) {
    console.error("Get services error:", error);
    response.sendError(res, 500, "Server error while fetching services");
  }
};

// GET -> Get Single Service (with SubServices)
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service;

    // Check if id is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      // If not ObjectId, try finding by slug
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return response.sendNotFound(res, "Service not found");
    }

    // Fetch related SubServices
    const subServices = await SubService.find({ service: service._id }).sort({
      name: 1,
    });

    response.sendSuccess(res, 200, "Service fetched successfully", {
      service: {
        ...service.toObject(),
        subServices, // Attaching sub-services here
      },
    });
  } catch (error) {
    console.error("Get service error:", error);
    response.sendError(res, 500, "Server error while fetching service");
  }
};

// PUT -> Update Service
exports.updateService = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return response.sendNotFound(res, "Service not found");
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== service.name) {
      const existingService = await Service.findOne({ name });
      if (existingService) {
        return response.sendError(
          res,
          400,
          "Service with this name already exists"
        );
      }
    }

    // Handle Image Logic
    let finalImageUrl = service.image;

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        finalImageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return response.sendError(res, 500, "Image upload failed");
      }
    } else if (image) {
      finalImageUrl = image;
    }

    // Update fields
    service.name = name || service.name;
    service.description =
      description !== undefined ? description : service.description;
    service.image = finalImageUrl;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    // save() triggers the pre-save hook to update slug automatically
    await service.save();

    response.sendSuccess(res, 200, "Service updated successfully", { service });
  } catch (error) {
    console.error("Update service error:", error);
    response.sendError(res, 500, "Server error while updating service");
  }
};

// DELETE -> Delete Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return response.sendNotFound(res, "Service not found");
    }

    //Delete associated sub-services logic
    await SubService.deleteMany({ service: service._id });

    await service.deleteOne();

    response.sendSuccess(res, 200, "Service deleted successfully");
  } catch (error) {
    console.error("Delete service error:", error);
    response.sendError(res, 500, "Server error while deleting service");
  }
};
