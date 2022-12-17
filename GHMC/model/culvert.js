const mongoose = require('mongoose');
const culvertSchema = new mongoose.Schema({
    name: 
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
        type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: false 
	}, 
    ward_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: false  
    },
    landmark_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'landmarks', required: false  
    },
    area_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'area', required: false  
	}, 
    area: 
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
    ward: 
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
    unique_no: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    qr_code_view: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    type: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    depth: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    user_id: 
	{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
	},
    latittude: 
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
    location: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    status: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    log_date_created: 
	{
        type: Date, 
        default: new Date() 
	},
    date: 
	{
        type: Date, 
        default: new Date() 
	},
    qr_image: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    created_by: 
	{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
	},
    log_date_modified:
    {
        type: Date, 
        default: new Date()
    },
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    place :  { type: {type:String}, coordinates: [Number]}
});
culvertSchema.index({ place: '2dsphere' });
module.exports = mongoose.model('culvert', culvertSchema);