const mongoose = require("mongoose");

const casting_Ad = mongoose.Schema({
  weight_out: String,
  finish_in: String,
  scrap_in: String,
  loss: String,
});

module.exports = mongoose.model("Casting_Ad", casting_Ad);
