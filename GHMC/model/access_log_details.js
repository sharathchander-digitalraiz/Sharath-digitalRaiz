const mongoose = require('mongoose');
const accesslogdetailsSchema = new mongoose.Schema({
    user_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true 
    },
    login_time:   
    {
        type: Date, 
        default: new Date()
    }, 
    logout_time:   
    {
        type: Date,  
        default: new Date()  
    },
    session:  
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    ip_address:  
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
    token:  
	{
        type: String, 
        required: true, 
        trim: true 
	}, 
    logout:  
	{
        type: String, 
        required: true, 
        trim: true 
	}
});
module.exports = mongoose.model('accesslogdetails', accesslogdetailsSchema); 