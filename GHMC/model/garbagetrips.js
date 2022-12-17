
const mongoose = require('mongoose');
const garbagetripsSchema = new mongoose.Schema({
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    before_image: 
	{ 
        type: String,  
        required: true, 
        trim: true 
    },
    after_image: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    import_gvp_bep_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'gvpbeps', required: false },
    date:
    {
        type: Date, 
        default: new Date()
    },
    time:
    {
        type: Date, 
        default: new Date()
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
    vehicle_type: 
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
        type: mongoose.Schema.Types.ObjectId, ref: 'wards', required: true
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
    latitude:{
        type: String, 
        required: true, 
        trim: true 
    },
    longitude:{
        type: String, 
        required: true, 
        trim: true 
    },
    type:{
        type: String, 
        required: true, 
        trim: true 
    }
});
module.exports = mongoose.model('garbagetrips', garbagetripsSchema);