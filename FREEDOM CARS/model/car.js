const mongoose = require("mongoose");
const car = new mongoose.Schema({
  carType: {
    type: String,
    enum: [
      "micro",
      "sedan",
      "hatchback",
      "universal",
      "liftback",
      "coupe",
      "suv",
      "crossover",
      "pickup",
      "van",
      "minivan",
      "minibus",
      "compactsuv",
      "mini",
      "miniprime",
      "sedanprime",
      "suvprime"
    ],
    required: true,
    trim: true,
    index: true
  },
  carImage: {
    type: Array
  },
  carRegisterImage: {
    type: Array
  },
  vehicleType: {
    type: String,
    enum: ["manual", "automatic", "battery"]
  },
  carBrandId: {
    type: mongoose.Schema.Types.ObjectId
  },
  carBrandName: {
    type: String
  },
  carModelId: {
    type: mongoose.Schema.Types.ObjectId
  },
  seatCount: {
    type: String
  },
  carModelName: {
    type: String
  },
  carMakeYearId: {
    type: mongoose.Schema.Types.ObjectId
  },
  carMakeYear: {
    type: String
  },
  carRegistNumber: {
    type: String
  },
  carColorAvailble: {
    type: Array
  },
  carFeatureId: {
    type: Array
  },
  carFeatures: {
    type: Array
  },
  carSpecId: {
    type: mongoose.Schema.Types.ObjectId
  },
  carSpecs: {
    type: String
  },
  carBootCapacity: {
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
  carAdminRating: {
    type: String,
    enum: ["1", "2", "3", "4", "5"],
    default: "4"
  },
  isPopular: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  isFeatured: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  isFavorite: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  isActive: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("cars", car);
