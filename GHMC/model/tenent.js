const users = require("../model/users");
const mongoose = require('mongoose');
const tenentSchema = new mongoose.Schema({
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    city:{
        type: String, 
        required: true, 
        trim: true 
    },
    district:{
        type: String, 
        required: true, 
        trim: true 
    },
    state:{
        type: String, 
        required: true, 
        trim: true 
    },
    status:
	{   
        type: String, 
	    default:'Active'
	}, 
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: users, required: true },
    log_date_created:   
    {
        type: Date, 
        default: new Date()
    }, 
    log_date_modified:   
    {
        type: Date, 
        default: new Date()
    },
    image:
    {
        type: String,
        required: true, 
        trim: true 
    },
     modified_by: { type: mongoose.Schema.Types.ObjectId, ref: users, required: false, default: null }
});
module.exports = mongoose.model('tenent', tenentSchema); 