const mongoose = require("mongoose");
const summaryDetail = new mongoose.Schema(
  {
    summaryNumber: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    shapeCut: {
      type: String,
    },
    totalEstWt: {
      type: String,
    },
    color: {
      type: String,
    },
    clarity: {
      type: String,
    },
    comment: {
      type: String,
    },
    sumid: {
      type: Number,
    },
    softcopy: {
      type: String,
    },
    qrcode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("summaryDetails", summaryDetail);
