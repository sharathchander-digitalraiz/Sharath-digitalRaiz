const mongoose = require("mongoose");
const countrtyCode = new mongoose.Schema(
  {
    countryName: {
      type: String,
      required: true
    },
    cellCode: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      enum: [false, true],
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("countrtyCodes", countrtyCode);
