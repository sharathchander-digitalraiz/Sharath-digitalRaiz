const mongoose = require("mongoose");

const roles = mongoose.Schema({
    role_name:{
        type:String,
        unique:true,
        index:true,
        required:true, 
    },
    access:[],
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
},{timestamps:true});

module.exports =  mongoose.model("Roles",roles)
