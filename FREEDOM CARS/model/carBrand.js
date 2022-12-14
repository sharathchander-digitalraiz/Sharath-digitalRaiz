const mongoose = require("mongoose");
const carBrand = new mongoose.Schema({
  title: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  isActive: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("carBrands", carBrand);
