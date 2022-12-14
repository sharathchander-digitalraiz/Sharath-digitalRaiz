const mongoose = require("mongoose");
const carModel = new mongoose.Schema({
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
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  brandName: {
    type: String
  },
  model_name: {
    type: String,
    required: true
  },
  noOfSeats: {
    type: Number,
    required: true
  },
  carImage: {
    type: Array
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

module.exports = mongoose.model("carModels", carModel);
