const mongoose = require("mongoose");
const carSpec = new mongoose.Schema({
  specName: {
    type: String,
    required: true
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

module.exports = mongoose.model("carSpecs", carSpec);
