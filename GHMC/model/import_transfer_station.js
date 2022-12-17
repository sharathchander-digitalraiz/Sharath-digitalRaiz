const mongoose = require('mongoose');
const importtransferstationSchema = new mongoose.Schema({

    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    transfer_station_userid: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Users',
        required: true, 
        trim: true 
    },
    address:  
	{  
        type: String, 
        required: true, 
        trim: true 
    },
    longitude:    
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    lattitude: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    image: 
	{
        type: String, 
       // required: true, 
        trim: true 
	},
    date: 
	{
        type: Date,  
        default: new Date()
	},
    time: 
	{
        type: Date,  
        default: new Date()
	},
    status: 
	{
        type: String, 
	    default:'Active'
	}, 
   
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'}, 
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
  
});
module.exports = mongoose.model('import_transfer_station', importtransferstationSchema); 