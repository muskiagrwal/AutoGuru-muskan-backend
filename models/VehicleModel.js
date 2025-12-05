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
    },
     slug: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from name
VehicleModelSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

//index
VehicleModelSchema.index({ brand: 1, name: 1 }, { unique: true });  
VehicleModelSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("VehicleModel", VehicleModelSchema);  