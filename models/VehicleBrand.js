const mongoose = require("mongoose");

const VehicleBrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      default: ""
    },

    facts: {
      type: String,
      default: ""
    },

    logbookCost: {
      type: Number,
      default: 0
    },

    basicCost: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

//index for brand name
VehicleBrandSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("VehicleBrand", VehicleBrandSchema);
