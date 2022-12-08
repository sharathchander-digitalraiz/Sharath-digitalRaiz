const mongoose = require("mongoose");

const issued_wax_to = mongoose.Schema({
    name:String,
})

module.exports = mongoose.model("Issued_wax_to",issued_wax_to)