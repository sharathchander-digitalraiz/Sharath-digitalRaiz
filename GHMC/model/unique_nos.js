
const mongoose = require('mongoose');
const uniqueno_Schema = new mongoose.Schema({
    unique_no: 
	{ 
        type: String, 
        required: true, 
        trim: true  
    },
    type_db: 
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
    //created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
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
module.exports = mongoose.model('unique_nos', uniqueno_Schema); 