const mongoose = require("mongoose");

const ghat = mongoose.Schema({
  Date: String,
  gold_out: String,
});

module.exports = mongoose.model("Ghat", ghat);
