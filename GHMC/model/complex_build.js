const mongoose = require('mongoose');

const complex_att_Schema = new mongoose.Schema({
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
    circle_no: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    circle: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    wards_no: 
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
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    address: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    basements: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    ground_floors: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    floors: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
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
    latitude:
    {
        type: String, 
        required: false, 
        trim: true,
        default: null
    },
    longitude:
    {
        type: String, 
        required: false, 
        trim: true,
        default: null
    },
    image:
    [
        { img: { type: String } }
    ],
});
module.exports = mongoose.model('comercial_building', complex_att_Schema);