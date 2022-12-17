const mongoose = require('mongoose');

const Notification_Schema = new mongoose.Schema({
    date: 
	{ 
        type: String, 
        required: true,  
        trim: true 
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    title: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },  
    description:
    {
        type: String, 
        required: true, 
        trim: true 
    },
    image_url:{
        type: String, 
        required: true, 
        trim: true
    },
    status:{
        type: String, 
        required: true, 
        default:'Active'  
    },
    zones_id: { type: String, required: false}, 
    circles_id: { type:String, required: false},
    ward_id: { type: String,  required: false},  
    landmark_id: { type:String, required: false}, 
    area_id:{type: String, required: false},
    tenent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
})

module.exports = mongoose.model('notification_fcm', Notification_Schema);   