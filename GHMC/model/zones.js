
const mongoose = require('mongoose');
const zonesSchema = new mongoose.Schema({
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    zone_no:{
        type: Number,  
        required: true, 
        trim: true 
    },
    status: 
	{
        type: String, 
	    default:'Active' 
	}, 
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true },
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
module.exports = mongoose.model('zones', zonesSchema);