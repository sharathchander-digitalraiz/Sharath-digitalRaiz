const mongoose = require('mongoose');
const useraccessSchema = new mongoose.Schema({
    name:  
	{ 
        type: String,  
        required: true,  
        trim: true 
    },   
    tenent_id:   
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true 
    },   
    geo_tag_id:   
	[   
        String   
    ],  
    app_access_ids:  
	[   
        String   
    ],   
    complex_access_ids:  
	[   
        String   
    ], 
    zones:   
	[     
        String   
    ],   
    circles:   
	[
        String  
    ], 
    ward:   
	[   
        String   
    ],   
    landmarks:   
	[
        String   
    ], 
    areas:[
        String
    ],
    status:{  
        type: String,  
	    default:'Active'  
    },
    log_date_created:    
    { 
        type: Date,   
        default: new Date() 
    },
    appaccess:{},
    admin_access:[{}]
        
    

});
module.exports = mongoose.model('useraccess', useraccessSchema); 