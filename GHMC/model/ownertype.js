
const mongoose = require('mongoose');
const ownertypeSchema = new mongoose.Schema({
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },

    status: 
	{
        type: String, 
	   
	}, 
    tenent_name: { type: String, required:false, trim:true}, 
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
    tenent_id : {type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    log_date_created:   
    {
        type: Date, 
        default: new Date()  
    },
    log_date_modified:
    {
        type: Date, 
        default: new Date()  
    }
});
module.exports = mongoose.model('owner_type', ownertypeSchema);