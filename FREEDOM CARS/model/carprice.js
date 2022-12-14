const mongoose = require("mongoose");
const carprice = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  kms:{
    type: String,
    index: true
  },
  sixHoursprice: {
    type: String
  },
  tweleveHoursprice: {
    type: String
  },
  onedayPrice: {
    type: String
  }
});
module.exports = mongoose.model("carprice", carprice);
