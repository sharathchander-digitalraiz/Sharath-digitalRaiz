const mongoose = require("mongoose");

const ghatAdmin = mongoose.Schema({
  Date: String,
  department_Id:{
    type:mongoose.Schema.Types.ObjectId,
  ref: "Department",
  }, 
  designation: {
    type:mongoose.Schema.Types.ObjectId,
  ref: "Admin_Emp_Model",
  },
  employee_name: String,
  gold_weight: String,
});

module.exports = mongoose.model("GhatAdmin", ghatAdmin);
