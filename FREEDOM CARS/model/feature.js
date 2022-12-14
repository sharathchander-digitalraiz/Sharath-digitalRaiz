const mongoose = require("mongoose");

const feature = new mongoose.Schema({
  featureName: {
    type: String,
    required: true,
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("Feature", feature);
