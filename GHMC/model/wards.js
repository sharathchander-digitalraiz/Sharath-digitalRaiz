
const mongoose = require('mongoose');
const wardsSchema = new mongoose.Schema({
    wards_no: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
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
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: false},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
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
module.exports = mongoose.model('wards', wardsSchema);