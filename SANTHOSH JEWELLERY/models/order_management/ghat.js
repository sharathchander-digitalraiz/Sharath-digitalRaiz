const mongoose = require("mongoose");

const ghat = mongoose.Schema({
  Date: String,
  gold_weight: String,
  issued_to: String,
});

module.exports = mongoose.model("Ghat", ghat);
