const mongoose = require('mongoose');
const importdataSchema = new mongoose.Schema({
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
        required: true, 
        trim: true 
	},
    ward_name: 
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    sfa_name: 
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    sfa_mobile_number: 
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    vechile_registration_number: 
	{
        type: String, 
        required: true, 
        trim: true 
	},  
    vechile_type: 
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
    vechile_allocated_location: 
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    transfer_attached: 
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    remarks: 
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
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
    qr_code_view: 
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
    zone_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: false
	},
    circle_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: false
	},
    ward_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: false
	},
    vechiletype: 
	{
        type: String, 
        required: true, 
        trim: true 
	},
    vechile_type_id:{
        type: String, 
        required: true, 
        trim: true 
    },
    tansfer_station_id:{
        type: String, 
        required: true, 
        trim: true 
    },
    type:{
        type: String, 
        required: true, 
        trim: true 
    },
    landmark_id:{
        type: mongoose.Schema.Types.ObjectId, ref: 'landmarks', required: false
    },
    log_date_modified:
    {
        type: Date, 
        default: new Date()  
    },
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
});
module.exports = mongoose.model('import_data', importdataSchema); 