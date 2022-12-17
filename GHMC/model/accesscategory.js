const mongoose = require('mongoose');
const accesscategorySchema = new mongoose.Schema({
    category_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, 
        required: true
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
    key_type: 
    {
        type: String,
        required: false, 
        trim: true 
    },
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false,default: null }
});
module.exports = mongoose.model('accesscategory', accesscategorySchema);