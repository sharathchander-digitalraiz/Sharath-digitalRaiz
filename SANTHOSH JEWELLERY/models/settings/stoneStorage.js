const mongoose = require("mongoose");

const stoneStorage = mongoose.Schema(
  {
    pk_no: String,
    item_type: String,
    piece: String,
    qty_gr: String,
    qty_ct: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoneStorage", stoneStorage);
