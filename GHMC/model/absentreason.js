const mongoose = require('mongoose');
const absentreasonSchema = new mongoose.Schema({
    vehicle_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', required: true 
    },
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    comment: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    reason: 
	{ 
        type: String, 
        required: false, 
        trim: true ,
        default:null
    },
    date:   
    {
        type: String, 
        required: true, 
        trim: true ,
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
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
});
module.exports = mongoose.model('absentreason', absentreasonSchema);  