
const mongoose = require('mongoose');
const supportSchema = new mongoose.Schema({
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: true},
    zone: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    circle: 
	{ 
        type: String, 
        required: true, 
        trim: true  
    },
    image: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    description:{
        type: String,  
        required: true, 
        trim: true 
    },
    status: 
	{
        type: String, 
	    default:'Active' 
	}, 
    reason:{ 
        type: String, 
	    required:false,
        trim:true
    },
    tenent_id : {type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    support_list_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, 
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
     modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false ,default: null  }

});
module.exports = mongoose.model('support', supportSchema);