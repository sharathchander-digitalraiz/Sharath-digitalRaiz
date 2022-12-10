const mongoose = require("mongoose");

const rings = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "In Active"],
    default: "Active",
  },
  created_by: {
    type : String
  },
  log_date_created: String,
  modified_by: String,
  log_date_modified: String,
},{timestamps:true});

module.exports = require("Rings",rings)