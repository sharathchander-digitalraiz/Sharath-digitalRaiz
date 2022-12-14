const mongoose = require("mongoose");
const state = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  countryName: {
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

module.exports = mongoose.model("states", state);
