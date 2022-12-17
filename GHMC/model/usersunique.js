
const mongoose = require('mongoose');
const usersuniqueSchema = new mongoose.Schema({
    first_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    last_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    deparment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'department', required: true},
    department_name:{
        type: String, 
        required: true,   
        trim: true      
    }, 
    user_access_id:   
	{    
        type: Number, 
        required: true, 
        trim: true
	}, 
    password:{   
        type: String,   
        required: true,  
        trim: true   
    },  
    email:{
        type: String, 
        required: true, 
        trim: true 
    },
    mobile_number:{
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
});
module.exports = mongoose.model('users_unique', usersuniqueSchema);