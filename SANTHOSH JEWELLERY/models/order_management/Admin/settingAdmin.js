const mongoose = require("mongoose");

const settingAdmin = mongoose.Schema({
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
  weight_added: String,
});

module.exports = mongoose.model("SettingAdmin", settingAdmin);
