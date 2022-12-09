const mongoose = require("mongoose");

const bandiniAdmin = mongoose.Schema(
  {
    date: String,
    department_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    designation: String,
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_Emp_Model",
    },
    employee_name: String,
    item_wt_removed: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BandiniAdmin", bandiniAdmin);
