const mongoose = require('mongoose');
const family_memSchema = new mongoose.Schema({
    user_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true    
    },
    family_member_no:{
        type:String
    },
    date:{
        type:String
    },
    uuid: 
	{ 
        type: String, 
        required: true, 
        trim: true  
    },
    name: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    age: 
	{ 
        type: Number, 
        required: false, 
        trim: true 
    },
    mobile: 
	{ 
        type: Number, 
        required: false, 
        trim: true 
    },
    gender: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    aadhar: 
	{ 
        type: Number, 
        required: false, 
        trim: true 
    },
    vaccine_type: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    vaccine_yes_no:{
        type: String, 
        required: false, 
        trim: true 
    },
    first_dose_yes_no:{
        type: String, 
        required: false, 
        trim: true
    },
    first_dost_date:{
        type: String, 
        required: false, 
        trim: true
    },
    second_dose_yes_no:{
        type: String, 
        required: false, 
        trim: true
    },
    second_dose_date:{
        type: String, 
        required: false, 
        trim: true
    },
    status:  
	{
        type: String, 
	    default:'Active'
	}, 
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: false  
    }, 
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
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false, default: null }
});
module.exports = mongoose.model('familymembers', family_memSchema); 