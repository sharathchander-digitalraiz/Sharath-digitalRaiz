const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: String,
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    designation: String,
    department:String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipcode: Number,
    role: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    avatar: String,
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Schema", schema);
