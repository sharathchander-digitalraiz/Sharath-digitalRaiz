const mongoose = require('mongoose');
const operations_Schema = new mongoose.Schema({
    date: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    time: 
	{ 
        type: String, 
        required: false, 
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
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: true},
    ward_id: { type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: true},
    landmark_id: { type: mongoose.Schema.Types.ObjectId, ref: 'landamrks', required: true},
    area_id:{type: mongoose.Schema.Types.ObjectId, ref: 'area', required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
   // place :  { type: {type:String}, coordinates: [Number]},
   collection_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'toilets', required: false
    },
    toilet_name: {
        type: String,
        required:true,
        trim:true
    },
    address: {
        type: String,
        required:true,
        trim:true
    },
    wt_type: 
	{ 
        type: String, 
        required: false, 
        trim: false 
    },
    picked_denied:
    {
        type:String,
        required:false,
        trim:false
    },
    approx_weight:
    {
        type:Number,
        required:false,
        trim:false
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
    attend:
    {
        type:String,
        required:false
    },
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
    modified_by:{type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false},
    incharge_name:{
        type:String,
        required:false
    },
    property_no:{
        type: String,
        required:false
    },
    incharge_mobile:{
        type: String,
        required:false
    },
    existing_disposal:{
        type:String,
        required:false
    },
    quality_of_waste:{
        type:String,
        required:false
    },
    wastage_quantity:{
        type:String,
        required:false
    }

});
// operations_Schema.index({ place: '2dsphere' });
module.exports = mongoose.model('temple_operation', operations_Schema);   