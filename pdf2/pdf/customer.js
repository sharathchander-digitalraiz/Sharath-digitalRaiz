const mongoose = require("mongoose");

const cst = new mongoose.Schema({
    name: {
    type: String,
    //required: true,
    trim: true,
    index: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },

});

module.exports = mongoose.model("cst", cst);
