const mongoose = require('mongoose');
const culvertsolvedSchema = new mongoose.Schema({
    culvert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'culvert', required: true},
    culvert_issue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'culvertissue', required: true},
    image: 
	{ 
        type: String, 
        required: true, 
        trim: true 
    },
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
    user_id:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true
    },
    status: 
	{
        type: String, 
	    default:'Active'
	}, 
    resolved_color: 
	{
        type: String, 
	    default:''
	}, 
    latitude: 
	{
        type: String, 
	    default:''
	}, 
    longitude: 
	{
        type: String, 
	    default:''
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
module.exports = mongoose.model('culvertsolved', culvertsolvedSchema);