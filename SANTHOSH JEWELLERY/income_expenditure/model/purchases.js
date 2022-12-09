const mongoose = require("mongoose");

const purchase = mongoose.Schema({
  infra_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Infra",
  },
  infra_name: String,
  amount: Number,
  remarks: String,
  date: String,
});

module.exports = mongoose.model("Purchase", purchase);
