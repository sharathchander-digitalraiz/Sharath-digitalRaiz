const mongoose = require("mongoose");

const ghatEmp = mongoose.Schema({
  date: String,
  name: String,
  gold_wt: String,
  status: ["Started", "Completed"],
});

module.exports = mongoose.model("GhatEmp", ghatEmp);
