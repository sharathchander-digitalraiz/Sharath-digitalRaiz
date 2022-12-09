const mongoose = require("mongoose");

const waxEmp = mongoose.Schema({
  date: String,
  name: String,
  status: ["Started", "Completed"],
});

module.exports = mongoose.model("WaxEmp", waxEmp);
