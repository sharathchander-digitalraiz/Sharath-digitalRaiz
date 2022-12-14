const mongoose = require("mongoose");
const country = new mongoose.Schema({
  countryName: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  countryFlag: {
    type: String,
    default: "uploads/public/countryFlag.png"
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

module.exports = mongoose.model("countrys", country);
