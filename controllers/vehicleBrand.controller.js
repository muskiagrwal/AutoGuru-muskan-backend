const VehicleBrand = require("../models/VehicleBrand");
const VehicleModel = require("../models/VehicleModel");
const response = require("../utils/response");

//POST=> Create new vehicle brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description, facts, logbookCost, basicCost } = req.body;

    // Check if brand already exists
    const existingBrand = await VehicleBrand.findOne({ name });
    if (existingBrand) {
      return response.sendError(
        res,
        400,
        "Brand with this name already exists"
      );
    }

    const brand = await VehicleBrand.create({
      name,
      description: description || "",
      facts: facts || "",
      logbookCost: logbookCost || 0,
      basicCost: basicCost || 0,
    });

    response.sendCreated(res, "Brand created successfully", { brand });
  } catch (error) {
    console.error("Create brand error:", error);
    response.sendError(res, 500, "Server error while creating brand");
  }
};

//GET-> Get all vehicle brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await VehicleBrand.find().sort({ name: 1 });
    response.sendSuccess(res, 200, "Brands fetched successfully", {
      brands,
      count: brands.length,
    });
  } catch (error) {
    console.error("Get brands error:", error);
    response.sendError(res, 500, "Server error while fetching brands");
  }
};

//GET-> Fetch car brand names only
exports.getBrandNames = async (req, res) => {
  try {
    const brands = await VehicleBrand.find()
      .select("name")
      .sort({ name: 1 })
      .lean();

    response.sendSuccess(res, 200, "Brands Name fetched", {
      brands,
    });
  } catch (error) {
    console.error("Get  brands name error:", error);
    response.sendError(res, 500, "Server error while fetching brands name");
  }
};

//GET-> Get single vehicle brand
exports.getBrandById = async (req, res) => {
  try {
    const brand = await VehicleBrand.findById(req.params.id);

    if (!brand) {
      return response.sendNotFound(res, "Brand not found");
    }

    response.sendSuccess(res, 200, "Brand fetched successfully", { brand });
  } catch (error) {
    console.error("Get brand error:", error);
    response.sendError(res, 500, "Server error while fetching brand");
  }
};

//PUT->Update vehicle brand
exports.updateBrand = async (req, res) => {
  try {
    const { name, description, facts, logbookCost, basicCost } = req.body;

    const brand = await VehicleBrand.findById(req.params.id);

    if (!brand) {
      return response.sendNotFound(res, "Brand not found");
    }

    // Check if new name already exists
    if (name && name !== brand.name) {
      const existingBrand = await VehicleBrand.findOne({ name });
      if (existingBrand) {
        return response.sendError(
          res,
          400,
          "Brand with this name already exists"
        );
      }
    }

    // Update fields
    brand.name = name || brand.name;
    brand.description =
      description !== undefined ? description : brand.description;
    brand.facts = facts !== undefined ? facts : brand.facts;
    brand.logbookCost =
      logbookCost !== undefined ? logbookCost : brand.logbookCost;
    brand.basicCost = basicCost !== undefined ? basicCost : brand.basicCost;

    await brand.save();

    response.sendSuccess(res, 200, "Brand updated successfully", { brand });
  } catch (error) {
    console.error("Update brand error:", error);
    response.sendError(res, 500, "Server error while updating brand");
  }
};

// DELETE -> Vehicle Brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await VehicleBrand.findById(req.params.id);

    if (!brand) {
      return response.sendNotFound(res, "Brand not found");
    }

    await VehicleModel.deleteMany({ brand: brand._id });

    await brand.deleteOne();

    response.sendSuccess(
      res,
      200,
      "Brand and associated models deleted successfully"
    );
  } catch (error) {
    console.error("Delete brand error:", error);
    response.sendError(res, 500, "Server error while deleting brand");
  }
};
