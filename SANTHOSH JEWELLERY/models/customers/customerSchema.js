const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  customer_name: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  mobile: {
    type: Number,
    trim: true,
    unique: true,
    index: true,
    required: true,
  },
  alternate_mobile: Number,
  email: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: String,
  state: String,
  country: String,
  created_date: String,
  created_by: String,
  modified_by: String,
  modified_date: String,
},{timestamps:true});

module.exports = mongoose.model("CustomerSchema", customerSchema);
