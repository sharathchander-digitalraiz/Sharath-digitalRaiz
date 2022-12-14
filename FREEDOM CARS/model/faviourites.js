const mongoose = require("mongoose");
const faviourites = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  }
});

module.exports = mongoose.model("faviourite", faviourites);
