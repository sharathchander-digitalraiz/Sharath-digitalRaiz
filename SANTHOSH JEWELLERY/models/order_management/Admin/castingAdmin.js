const mongoose = require("mongoose");

const casting_Ad = mongoose.Schema(
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
    weight_out: String,
    finish_in: String,
    scrap_in: String,
    loss: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Casting_Ad", casting_Ad);
