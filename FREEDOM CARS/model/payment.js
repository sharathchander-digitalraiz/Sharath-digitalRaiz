const mongoose = require("mongoose");
const payment = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  paymentStatus: {
    type: Number
    //enum: [0, 1] //0 is partial,1 is full
  },
  paymethod: {
    type: String,
    enum: ["cash", "paymentgateway"]
  },
  price: {
    type: String
  },
  gst: {
    type: String,
    default: "0"
  },
  transactionCharges: {
    type: String
  },
  discountPrice: {
    type: String
  },
  totalprice: {
    type: String
  },
  balanceAmount: {
    type: String,
    default:"0"
  },
  couponCode: {
    type: String
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  date: {
    type: String
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "cancelled",
      "completed",
      "inprogress",
      "partialcompleted"
    ],
    default: "pending"
  },
  transactionId: {
    type: String
  }
});

module.exports = mongoose.model("payment", payment);
