const mongoose = require("mongoose");

const infra = mongoose.Schema({
  infra_type: String,
  expenditure_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expenditure",
  },
  expenditure_name: String,
});

module.exports = mongoose.model("Infra", infra);
