const Notification_app = require("../../model/app_notification");
const Geotagtypes      = require('../../model/geotagtype'); 
const Departments      = require('../../model/department'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.app_notification = async (req, res) =>  
{
 
    const { user_id, title, message,status,time,geotagtypes_id,department_id,tenent_id } = req.body;
    const check_count = await Notification_app.find({geotagtypes_id:geotagtypes_id,department_id:department_id}).countDocuments();
    if(check_count >= 1){
          return res.status(400).send({login:true,status:false,message:'Data already exists'})
    }
    const list = new Notification_app({
        title: title,
        message:message,
        status: status,
        time: time,
        geotagtypes_id:geotagtypes_id,
        department_id:department_id, 
        created_by: user_id, 
        tenent_id:tenent_id
    });     
    list.save((error, list) => 
    {    
        if (error) return res.status(400).json({ error });                       
        if(list) 
        {                
           return  res.status(200).json({success: true, login: true, message: 'Saved successfully' });
        }   
    });   
    };



exports.get_all_app_notification = async(req,res)=>{
    const { user_id,tenent_id}= req.body; 
    if(tenent_id == '' || tenent_id == undefined)
    {
        return res.status(200).send({login:true,status:false,message:'Tenent id is required'})
    }

    const notification_details = await Notification_app.aggregate([ 
        {'$match': {tenent_id: ObjectId(tenent_id),delete:'Active'}},  
        {
            
            $lookup:{
                from: "tenents",       // other table name
                localField: "tenent_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "tenent_info"         // alias for userinfo table
            }
        },
        {   $unwind:"$tenent_info" },   
        {
            $lookup:{
                from: "departments",       // other table name
                localField: "department_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "department_info"         // alias for userinfo table
            } 
        },
        {   $unwind:"$department_info" },        
        {
            $lookup:{
                from: "geotagtypes",       // other table name
                localField: "geotagtypes_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "geotagtypes_info"         // alias for userinfo table
            } 
        },
        {   $unwind:"$geotagtypes_info" },        
        {   
            $project:{ 
                id : "$_id",  
                title:1,
                message:1,
                status:1, 
                time:1,
                geotagtypes_id:1,
                department_id:1,
                tenent : "$tenent_info.name",
                department : "$department_info.name",
                geotagtype : "$geotagtypes_info.name", 
            }
        }
    ]); 

   // console.log(notification_details); 
   return res.status(200).send({login:true,status:true,data:notification_details })

}



exports.update_notification = async(req,res)=>{
    const id = req.body.id;
    console.log(id); 
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }

    const updateRecords = {
        ...req.body, 
    }
    await Notification_app.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
        //  console.log(data);  
           if(err){ 
               return res.status(404).json({status:false,message:'Sorry unable to update'});   
           }else if(data == null){ 
               return res.status(404).json({status:false,message:'Invalid id'});   
           }else{   
               return res.status(200).json({status:true,message:'Updated Successfully'});   
           }
       }) 
}  


exports.delete_notification_app  = async (req, res) => { 
    const _id = req.body.id;    
   // console.log(id);
   
    await Notification_app.findByIdAndDelete({_id},(err,data)=>{  
     //  console.log(data); 
        if(err){ 
            return res.status(404).json({status:false,message:'Sorry unable to delete '});   
        }else if(data == null){
            return res.status(404).json({status:false,message:'No records found to delete'});   
        }else{  
            return res.status(200).json({status:true,message:'Deleted Successfully'});   
        }
    })      
  }

  exports.edit__notification = async (req,res) =>{   
    const id = req.body.id;  
    await Notification_app.findOne({_id:id},{delete:0,log_date_created:0,log_date_modified:0,modified_by:0,created_by:0},(err,data)=>{  
        if(err){ 
            return res.status(404).json({status:false,message:'Data not exists'});    
        }else{ 
            return res.status(200).json({status:true,data});          
        }
    })   
  }  
  

exports.get_geotagtypes = async(req,res)=>{
    const gettag_details = await Geotagtypes.find({},{name:1}).exec();
    return res.status(200).send({login:true,status:true,data:gettag_details})
}




exports.get_departments = async(req,res)=>{
    const department_details = await Departments.find({},{name:1}).exec();
    return res.status(200).send({login:true,status:true,data: department_details}) 
}

