const mongoose = require('mongoose');

const manholeOperations_Schema = new mongoose.Schema({
    date: 
	{ 
        type: String, 
        required: false, 
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
        required: false, 
        trim: true 
    },
    circle: 
	{ 
        type: String, 
        required: false, 
        trim: true  
    },
    ward_name: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    area: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    landmark: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: false},
    collection_id: { type: mongoose.Schema.Types.ObjectId,  required: false},
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: false},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: false},
    ward_id: { type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: false},
    landmark_id: { type: mongoose.Schema.Types.ObjectId, ref: 'landamrks', required: false},
    area_id:{type: mongoose.Schema.Types.ObjectId, ref: 'area', required: false},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false}, 
   // place :  { type: {type:String}, coordinates: [Number]},
    manhole_id: {
        type: String,
        required:false,
        trim:true
    },
    man_hole_name: {
        type: String,
        required:false,
        trim:true
    },
    address: {
        type: String,
        required:false,
        trim:true
    },
    type: {
        type: String,
        required:false,
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
});
// operations_Schema.index({ place: '2dsphere' });
module.exports = mongoose.model('manholeOperation', manholeOperations_Schema);   