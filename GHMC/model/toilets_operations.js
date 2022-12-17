const mongoose = require('mongoose');

const toilets_operations_Schema = new mongoose.Schema({
    date: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    zone: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    circle: 
	{ 
        type: String, 
        required: true, 
        trim: true  
    },
    ward_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    area: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    landmark: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    operation_type:
    {
        type: String, 
        required: false, 
        trim: true
    },
    reason_type:{
        type: String,  
        required: false,   
        trim: true
    },
    reason_type_description:{ 
        type: String,   
        required: false,  
        trim: true
    },
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: true},
    ward_id: { type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: true},
    landmark_id: { type: mongoose.Schema.Types.ObjectId, ref: 'landamrks', required: true},
    area_id:{type: mongoose.Schema.Types.ObjectId, ref: 'area', required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false}, 
    collection_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'toilets', required: true},
    wt_type: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    picked_denied:
    {
        type:String,
        required:false,
        trim:true
    },
    approx_weight:
    {
        type:Number,
        required:false,
        trim:true
    }, 
    reason:
    { 
        type:String,
        required:false
    },
    image:
    [
        { img: { type: String } }
    ],
    status: 
	{
        type: String, 
	    default:'Active'
	},    
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false}, 
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
    attend:
    {
        type: String, 
	    default:'0'
    },
    toilet_name:
    {
        type: String, 
        required:false
    },
    address:
    {
        type: String, 
        required:false
    },
    modified_by:{type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false},
});
// operations_Schema.index({ place: '2dsphere' });
module.exports = mongoose.model('toilets_operation', toilets_operations_Schema);   