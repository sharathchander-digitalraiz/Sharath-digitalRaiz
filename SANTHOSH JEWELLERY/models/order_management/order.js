const mongoose = require("mongoose");

const order = mongoose.Schema(
  {
    date: String,
    bill_no: String,
    order_no: Number,
    customer_details: String,
    mobile: Number,
    item_name: String,
    item_detail: String,
    item_purity: String,
    image: Array,
    gold_weight: String,
    stone_range: String,
    item_size: String,
    special_remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", order);
