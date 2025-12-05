const SubService = require("../models/SubService");
const Service = require("../models/Service");
const response = require("../utils/response");
const { uploadToCloudinary } = require("../config/uploadToCloudinary");

// POST -> Create SubService
exports.createSubService = async (req, res) => {
  try {
    const { service, name, description, price } = req.body;

    // Validate Parent Service
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return response.sendError(res, 404, "Parent Service not found");
    }

    // Check Duplicates (Scoped to Service)
    const existingSub = await SubService.findOne({ service, name });
    if (existingSub) {
      return response.sendError(
        res,
        400,
        "SubService with this name already exists in this Service category"
      );
    }

    // Handle Image
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

    // Create SubService
    const subService = await SubService.create({
      service,
      name,
      description: description || "",
      price: price || 0,
      image: finalImageUrl,
    });

    // UPDATE COUNT: Increment count in Parent Service
    await Service.findByIdAndUpdate(service, { $inc: { count: 1 } });

    await subService.populate("service", "name");

    response.sendCreated(res, "SubService created successfully", {
      subService,
    });
  } catch (error) {
    console.error("Create sub-service error:", error);
    response.sendError(res, 500, "Server error while creating sub-service");
  }
};

// GET -> Get All SubServices (With Filters)
exports.getAllSubServices = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const subServices = await SubService.find(filter)
      .populate("service", "name")
      .sort({ name: 1 });

    response.sendSuccess(res, 200, "SubServices fetched successfully", {
      subServices,
      count: subServices.length,
    });
  } catch (error) {
    console.error("Get sub-services error:", error);
    response.sendError(res, 500, "Server error while fetching sub-services");
  }
};

// GET -> Get SubServices by Service ID
exports.getSubServicesByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) {
      return response.sendNotFound(res, "Service category not found");
    }

    const subServices = await SubService.find({ service: serviceId })
      .populate("service", "name")
      .sort({ name: 1 });

    response.sendSuccess(res, 200, "SubServices fetched successfully", {
      subServices,
      count: subServices.length,
      parentService: serviceExists.name,
    });
  } catch (error) {
    console.error("Get sub-services by id error:", error);
    response.sendError(res, 500, "Server error while fetching sub-services");
  }
};

// GET -> Get Single SubService
exports.getSubServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let subService;

    // Check if id is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      subService = await SubService.findById(id).populate(
        "service",
        "name description"
      );
    } else {
      // If not ObjectId, try finding by slug
      // Note: slugs are usually unique, but ensure your schema enforces it
      subService = await SubService.findOne({ slug: id }).populate(
        "service",
        "name description"
      );
    }

    if (!subService) {
      return response.sendNotFound(res, "SubService not found");
    }

    response.sendSuccess(res, 200, "SubService fetched successfully", {
      subService,
    });
  } catch (error) {
    console.error("Get single sub-service error:", error);
    response.sendError(res, 500, "Server error while fetching sub-service");
  }
};

// PUT -> Update SubService
exports.updateSubService = async (req, res) => {
  try {
    const { service, name, description, price, image } = req.body;

    const subService = await SubService.findById(req.params.id);
    if (!subService) {
      return response.sendNotFound(res, "SubService not found");
    }

    // UPDATE COUNT LOGIC: If parent service is changing
    if (service && service !== subService.service.toString()) {
      const serviceExists = await Service.findById(service);
      if (!serviceExists) {
        return response.sendError(res, 404, "New Parent Service not found");
      }

      // Decrement count from OLD Service
      await Service.findByIdAndUpdate(subService.service, {
        $inc: { count: -1 },
      });

      // Increment count in NEW Service
      await Service.findByIdAndUpdate(service, { $inc: { count: 1 } });
    }

    // Check duplicates if name is changing
    if (name && name !== subService.name) {
      const parentId = service || subService.service;
      const existingSub = await SubService.findOne({
        service: parentId,
        name,
      });
      if (existingSub) {
        return response.sendError(
          res,
          400,
          "SubService with this name already exists in this Service category"
        );
      }
    }

    // Handle Image
    let finalImageUrl = subService.image;
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
    subService.service = service || subService.service;
    subService.name = name || subService.name;
    subService.description =
      description !== undefined ? description : subService.description;
    subService.price = price !== undefined ? price : subService.price;
    subService.image = finalImageUrl;

    await subService.save();
    await subService.populate("service", "name");

    response.sendSuccess(res, 200, "SubService updated successfully", {
      subService,
    });
  } catch (error) {
    console.error("Update sub-service error:", error);
    response.sendError(res, 500, "Server error while updating sub-service");
  }
};

// DELETE -> Delete SubService
exports.deleteSubService = async (req, res) => {
  try {
    const subService = await SubService.findById(req.params.id);
    if (!subService) {
      return response.sendNotFound(res, "SubService not found");
    }

    const parentServiceId = subService.service;

    await subService.deleteOne();

    // UPDATE COUNT: Decrement count in Parent Service
    if (parentServiceId) {
      await Service.findByIdAndUpdate(parentServiceId, { $inc: { count: -1 } });
    }

    response.sendSuccess(res, 200, "SubService deleted successfully");
  } catch (error) {
    console.error("Delete sub-service error:", error);
    response.sendError(res, 500, "Server error while deleting sub-service");
  }
};
