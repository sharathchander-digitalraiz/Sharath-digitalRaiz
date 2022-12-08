const mongoose = require("mongoose");
const adminEmpModel = mongoose.Schema(
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
    department_Id: {
      type: mongoose.Schema.Types.ObjectId, ref:"Department",
    },
    designation: String,
    departmentName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipcode: Number,
    role: String,
    status: {
      type: String,
      enum: ["Active", "In Active"],
      default: "Active",
    },
    avatar: String,
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Admin_Emp_Model", adminEmpModel);
