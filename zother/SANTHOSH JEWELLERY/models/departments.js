const mongoose = require("mongoose");

const department = mongoose.Schema({
    deptName:{
        type:String,
        unique:true,
        index:true,
        required:true, 
    },
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
},{timestamps:true});

module.exports =  mongoose.model("Department",department)
