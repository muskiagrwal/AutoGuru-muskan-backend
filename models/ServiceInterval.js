const mongoose = require("mongoose");

const ServiceIntervalSchema = new mongoose.Schema(
  {
    vehicleModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleModel",
      required: true
    },

    distance: {
      type: Number,
      required: true, //1000 
      min: 1000
    },

    timeInMonths: {
      type: Number,
      required: true, //23months
      min: 1
    },

    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceInterval", ServiceIntervalSchema);
