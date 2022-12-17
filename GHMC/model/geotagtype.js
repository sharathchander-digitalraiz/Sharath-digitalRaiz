
const mongoose = require('mongoose');
const geotagtypeSchema = new mongoose.Schema({
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
    created_by: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: "users",  
        required: true 
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
});
module.exports = mongoose.model('geotagtype', geotagtypeSchema);  