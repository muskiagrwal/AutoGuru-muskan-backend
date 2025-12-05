const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    image: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    features: [{
      type: String
    }],

    count: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from name
ServiceSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Indexing
ServiceSchema.index({ name: 1 }, { unique: true });
ServiceSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Service", ServiceSchema);
