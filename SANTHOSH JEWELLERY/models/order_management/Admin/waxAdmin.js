const mongoose = require("mongoose");

const issued_wax_to = mongoose.Schema({
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
});

module.exports = mongoose.model("Issued_wax_to", issued_wax_to);
