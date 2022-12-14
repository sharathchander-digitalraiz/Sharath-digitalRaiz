const mongoose = require("mongoose");
const customerWallet = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  customerName: {
    type: String
  },
  customerPhone: {
    type: String
  },
  customeremail: {
    type: String
  },
  wallet: {
    type: String,
    default: "0"
  },
  totalCharges: {
    type: String,
    default: "0"
  },
  reasonOfCharges: {
    type: String,
    default: ""
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("customerWallets", customerWallet);
