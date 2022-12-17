
const mongoose = require('mongoose');
const transferstationSchema = new mongoose.Schema({
    user_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true 
    },
    import_data_unique_no: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    geo_tag_id: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    date: 
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    time:{
        type: Date, 
        default: new Date()
    },
    wastage_type: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    wastage_weight: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    image: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
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
    zone_id: { type: mongoose.Schema.Types.ObjectId, ref: 'zones', required: true},
    circle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'circles', required: true},
    vechile_type: 
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
});
module.exports = mongoose.model('transfer_station', transferstationSchema);