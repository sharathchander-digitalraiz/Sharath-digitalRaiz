const mongoose = require('mongoose');
const departmentSchema = new mongoose.Schema({
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
    modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false, default: null }
});
module.exports = mongoose.model('department', departmentSchema);