
const mongoose = require('mongoose');

const app_notificationSchema = new mongoose.Schema({

    title: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    message: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    delete:{
        type: String, 
        required: true, 
        default : 'Active'
    },
    status:   
	{  
        type: String,   
        required: true,
	}, 
    time:{ type: String,required: true},
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true },
    geotagtypes_id: { type: mongoose.Schema.Types.ObjectId, ref: 'geotagtypes', required: true },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'departments', required: true }, 
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false,default: null }
});
module.exports = mongoose.model('notification_moduletype', app_notificationSchema); 