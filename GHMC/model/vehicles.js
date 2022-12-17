const users = require("../model/users");
const tenent = require("../model/tenent");
const zones = require("../model/zones");
const circles=require("../model/circles");
const mongoose = require('mongoose');
const vehiclesSchema = new mongoose.Schema({
    wards_no: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    circle_no: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    image: 
	{ 
        type: String, 
        required: false, 
        trim: true 
    },
    vehicle_type: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    vehicle_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicles_types', required: true},
    vehicle_registration_number: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    transfer_station_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    transfer_station: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    driver_name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    driver_number: 
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
    incharge_mobile_number: 
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
    ward_name: 
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
    zone: 
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
    area_name:{
        type: String, 
        required: true, 
        trim: true 
    },
    owner_type: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    owner_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'owner_types', required: true},
    status: 
	{
        type: String, 
	    default:'Active'
	}, 
	qr_code_view:{
	     type: String
	},
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    zones_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true},
    circles_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: false},
    ward_id: { type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: false},
    landmark_id: { type: mongoose.Schema.Types.ObjectId, ref: 'landmarks', required: false},
    area_id: { type: mongoose.Schema.Types.ObjectId, ref: 'areas', required: false},
    sfa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false},
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
});
module.exports = mongoose.model('vehicles', vehiclesSchema);