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
    },

    slug: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from name
VehicleBrandSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

//index for brand name
VehicleBrandSchema.index({ name: 1 }, { unique: true });
VehicleBrandSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("VehicleBrand", VehicleBrandSchema);
