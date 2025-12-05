const mongoose = require("mongoose");

const SubServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Reference to the parent Service model
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    image: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from name
SubServiceSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Indexing
SubServiceSchema.index({ service: 1, name: 1 }, { unique: true });
SubServiceSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("SubService", SubServiceSchema);
