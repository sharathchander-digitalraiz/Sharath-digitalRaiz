const mongoose = require('mongoose');
const tentent_geotagging_access_Schema = new mongoose.Schema({
    tenent_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    
    tenent_id : {type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    geo_tag_access:[
       
    ],
    status: 
	{
        type: String, 
	    required:true,
        trim:true
	},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},  
});   
module.exports = mongoose.model('tentent_geo_access', tentent_geotagging_access_Schema); 