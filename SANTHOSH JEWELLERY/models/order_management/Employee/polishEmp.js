const mongoose = require("mongoose");

const polishEmp = mongoose.Schema({
  date: String,
  name: String,
  gold_added: String,
  balance_gold: String,
  status: ["Started", "Completed"],
});

module.exports = mongoose.model("PolishEmp", polishEmp);
