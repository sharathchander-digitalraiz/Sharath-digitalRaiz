const mongoose = require("mongoose");
const version = new mongoose.Schema({
  brandId: {
    type: String,
    required: true
  },
  brand_name: {
    type: String
  },
  modelId: {
    type: String,
    required: true
  },
  model_name: {
    type: String
  },
  carVersion: {
    type: String
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
});

module.exports = mongoose.model("Version", version);
