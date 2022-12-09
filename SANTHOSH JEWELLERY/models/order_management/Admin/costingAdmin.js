const mongoose = require("mongoose");

const settingAdmin = mongoose.Schema(
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
    gross: String,
    stone: String,
    nett: String,
    item_purity: String,
    fine: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SettingAdmin", settingAdmin);
