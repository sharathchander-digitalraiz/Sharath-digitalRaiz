const mongoose = require("mongoose");

const beeds = mongoose.Schema(
  {
    pocket_no: String,
    item: String,
    qty_ct: String,
    rate_ct: String,
    Amount: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beeds", beeds);
