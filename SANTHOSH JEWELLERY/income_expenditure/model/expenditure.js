const mongoose = require("mongoose");

const expenditure = mongoose.Schema({
    expenditure_type : String
})

module.exports = mongoose.model("Expenditure",expenditure);