const mongoose = require("mongoose");

const issued_casting_to = mongoose.Schema({
  weight_out: String,
  finish_in: String,
  scrap_in: String,
  loss: String,
});

module.exports = mongoose.model("Issued_casting_to", issued_casting_to);
