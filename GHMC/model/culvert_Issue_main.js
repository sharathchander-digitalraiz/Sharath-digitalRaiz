const mongoose = require('mongoose');
const culvertissueSchema = new mongoose.Schema({
    culvertname: 
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
    date: 
	{ 
      type: String
    },
    time:
   {
        type: String
    },
    issue_name:
    {
            type: String
    },
    culvert_id:   
    { 
            type: mongoose.Schema.Types.ObjectId, ref: 'culvert', required: true 
    },
    culvertType:
    {
        type: String
    },
    issue_depth: 
	{
        type: String,
        required:false
	},
    type: 
	{
        type: String, 
        required: false, 
        trim: true 
	},
    isse_type_id:
    {
     type: mongoose.Schema.Types.ObjectId, ref: 'issuetype', required: false 
    },
     image:{
        type: String, 
        required: false,  
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
    landmark_id: 
	{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'landmarks', required: false  
    },
    area_id: 
	{
        type: mongoose.Schema.Types.ObjectId, ref: 'area', required: false  
	}, 
    area: 
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
    status: 
	{
        type: String, 
        required: false, 
        trim: true 
	},
    user_id: 
	{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: false 
	},
    log_date_created: 
	{
        type: Date,  
        default: new Date() 
	},
    created_by: 
	{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: false 
	},
    log_date_modified:
    {
        type: Date, 
        default: new Date() 
    },
    solved_time:{
        type: String, 
        default: ""
    },
    solved_color:{
        type: String, 
        required: false, 
        trim: true,
        default:"-"
    },
    solved_image:{
        type: String, 
        required: false, 
        trim: true,
        default:"-"
    },
    solved_date:{
        type: String, 
        required: false, 
        trim: true,
        default:"-"
    },
    modified_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }
});
module.exports = mongoose.model('culvert_Issue_main', culvertissueSchema);