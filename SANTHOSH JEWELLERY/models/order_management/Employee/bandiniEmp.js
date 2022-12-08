const mongoose = require("mongoose");

const bandiniEmp = mongoose.Schema({
  date: String,
  karigar: String,
  item_wt_add: String,
  stone: String,
  net_weight: String,
  status: ["Started", "Completed"],
});

module.exports = mongoose.model("BandiniEmp", bandiniEmp);
