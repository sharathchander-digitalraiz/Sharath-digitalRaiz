
const mongoose = require('mongoose');
const areaSchema = new mongoose.Schema({
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    status:   
	{  
        type: String,   
	    default:'Active'  
	}, 
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true,index: true},
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true,index: true},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: true,index: true},
    wards_id: { type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: true,index: true},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true,index: true}, 
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false,default: null }
});
module.exports = mongoose.model('area', areaSchema); 