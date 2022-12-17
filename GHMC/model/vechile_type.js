const mongoose = require('mongoose');
const vechiletypeSchema = new mongoose.Schema({
    name: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
    vechile_weight:{
        type: Number,
        required: true, 
        trim:true
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
module.exports = mongoose.model('vehicles_type', vechiletypeSchema);