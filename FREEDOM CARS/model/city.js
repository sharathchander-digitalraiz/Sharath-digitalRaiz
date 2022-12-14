const mongoose = require("mongoose");
const city = new mongoose.Schema({
  cityName: {
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
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  stateName: {
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

module.exports = mongoose.model("citys", city);
