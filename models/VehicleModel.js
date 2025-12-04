const mongoose = require("mongoose");

const VehicleModelSchema = new mongoose.Schema(  
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleBrand",
      required: true,
      index: true 
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true 
    },

    imageUrl: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: ""
    },

    rating: {
      type: Number,
      default: 4.5
    },

    quotesProvided: {
      type: String,
      default: ''
    },

    expertMechanics: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

//index
VehicleModelSchema.index({ brand: 1, name: 1 }, { unique: true });  

module.exports = mongoose.model("VehicleModel", VehicleModelSchema);  