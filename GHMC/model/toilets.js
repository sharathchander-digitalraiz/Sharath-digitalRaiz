const mongoose = require('mongoose');

const Toilets_Schema = new mongoose.Schema({
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
    address: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    toilet_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    incharge_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    property_no:{
        type: Number, 
        required: true, 
        trim: true 
    },
    incharge_mobile: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    existing_disposal: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    quality_of_waste: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    wastage_quantity: 
	{ 
        type: Number, 
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
    image:
    {
        type: String,
        required: false 
    },
    place :  { type: {type:String}, coordinates: [Number]}, 
    image:
    [
        { img: { type: String } }
    ],
    unique_no: 
	{
        type: String, 
        required: false, 
        trim: true 
	},
    qr_code_view: 
	{
        type: String, 
        required: false, 
        trim: true 
	},
    qr_image: 
	{
        type: String, 
        required: false, 
        trim: true 
	},
});
Toilets_Schema.index({ place: '2dsphere' });   
module.exports = mongoose.model('toilets', Toilets_Schema);   