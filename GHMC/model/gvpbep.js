const mongoose = require('mongoose');
const gvpbepSchema = new mongoose.Schema({
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
    ward_no: 
	{
        type: String, 
        required: false,
        default:null,
        trim: true 
	}, 
    ward_name: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    incharge: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    designation: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    mobile_number: 
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
    location: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
  
    zone_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true
	},
    circle_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: true
	},
    ward_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: true
	},
    landmark_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: false,default:null
	},
    area_id:{type: mongoose.Schema.Types.ObjectId, ref: 'area', required: false},
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    type: 
	{
        type: String,  
        required: true, 
        trim: true 
	},
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    place :  { type: {type:String}, coordinates: [Number]}
});
gvpbepSchema.index({ place: '2dsphere' });
module.exports = mongoose.model('gvpbep', gvpbepSchema);  