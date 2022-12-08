const mongoose = require("mongoose");

const department = mongoose.Schema({
    deptName:{
        type:String,
        unique:true,
        index:true,
        required:true, 
    }
},{timestamps:true});

module.exports =  mongoose.model("Department",department)
