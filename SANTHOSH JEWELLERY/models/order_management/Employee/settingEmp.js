const mongoose = require("mongoose");

const settingEmp = mongoose.Schema({
  date: String,
  received_name:String,
  wt_added: String,
  item_wt_add: String,
  stone: String,
  net_weight: String,
  net_chura: String,
  status: ["Started", "Completed"],
});

module.exports = mongoose.model("SettingEmp", settingEmp);
