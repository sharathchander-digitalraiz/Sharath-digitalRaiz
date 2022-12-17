const mongoose = require('mongoose');

const communityhall_Schema = new mongoose.Schema({
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
    business_name:{
        type: String, 
        required: true, 
        trim: true,
    },
    business_type: 
	{ 
        type: String, 
        required: true,  
        trim: true,
    },
    type_community: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    shop_address: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    owner_name: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    owner_mobile: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    owner_aadhar: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    licence_number: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    licence_no: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    existing_disposal: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    quality_waste: 
	{ 
        type: String, 
        required: true, 
        trim: true,
    },
    wastage_quantity: 
	{ 
        type: Number, 
        required: true, 
        trim: true,
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
communityhall_Schema.index({ place: '2dsphere' });
module.exports = mongoose.model('communityhall', communityhall_Schema);   