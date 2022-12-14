const mongoose = require("mongoose");
const coupon = mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  coupon_code: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  coupon_code_type: {
    type: String,
    enum: ["price", "percentage"]
  },
  amount: {
    type: String
  },
  from_date: {
    type: String
  },
  to_date: {
    type: String
  },
  description: {
    type: String
  },
  couponUsage: {
    type: String,
    enum: ["single", "multiple"],
    default: "single"
  },
  logDateCreated: {
    type: String,
  },
  logDateModified: {
    type: String,
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("Coupon", coupon);
