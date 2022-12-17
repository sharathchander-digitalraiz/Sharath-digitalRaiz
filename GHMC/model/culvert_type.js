const mongoose = require('mongoose');
const culverttypeSchema = new mongoose.Schema({
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
   
    tenent_id : {type: mongoose.Schema.Types.ObjectId, ref: 'tenent', required: true},
    tentent_name:{ type :String, trim:true}, 
    status: 
	{
        type: String, 
	    default:'Active'
	},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
});  
module.exports = mongoose.model('culvert_type', culverttypeSchema);