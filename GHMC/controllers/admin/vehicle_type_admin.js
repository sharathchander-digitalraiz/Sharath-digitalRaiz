const Vechile_type= require("../../model/vechile_type");
const tenents = require('../../model/tenent'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.createVechile_type = async (req, res) => 
{
 
  const { name,vechile_weight,status,tenent_id,user_id} = req.body;
  var t_name = await tenents.findOne({_id: tenent_id},{_id: 1, name: 1 }).exec(); 
  const list = new Vechile_type({
    name:name,
    status:status,
    vechile_weight:vechile_weight,
    created_by: user_id, 
    tenent_id:tenent_id,
    tentent_name:t_name.name
}); 
list.save((error, list) => 
{    
    if (error) return res.status(400).json({ error });                       
    if(list) 
    {                
        res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }   
  });   
};


exports.getallVechile_type = async (req,res)=>{     
    const alldata = await Vechile_type.find({status:'Active'}).exec(); 
    return res.status(200).json({status:true,data:alldata});   
  }  


  
exports.TenentallVechile_type = async (req,res)=>{    
  const {tenent_id} = req.body;
  const alldata = await Vechile_type.find({status:'Active',tenent_id:tenent_id}).exec(); 
  return res.status(200).json({status:true,data:alldata});   
}  

  exports.editVechile_type = async (req,res) =>{   
    const id = req.body.id;  
    console.log(id); 

   const vehicle_t = await Vechile_type.aggregate([
      { "$match": {_id: {$in:[ObjectId(id)]}} },  
      {   
        $lookup:{
            from: "tenents",       // other table name
            localField: "tenent_id",   // name of users table field
            foreignField: "_id", // name of userinfo table field
            as: "tenent_info"         // ali as for userinfo table
        } 
      },// define which fields are you want to fetch 
      {   $unwind:"$tenent_info" },
      {
        $project:{ 
          _id : 1, 
          name:1, 
          vechile_weight:1,
          status:1,
          tenent_id:1,
          tenent_n : "$tenent_info.name", 
        }
      }
      ]);   
    
    return res.status(200).json({status:true,message:'Success',data:vehicle_t});    
  }


  exports.deleteVechile_type = async (req, res) => { 
    const _id = req.body.id;    
   // console.log(id);
    const updateRecords={ 
      status:'In-active' 
    }
    await Vechile_type.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{  
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


  exports.updateVechile_type = async(req,res)=>{
    const id = req.body.id;
   // console.log(id); 
    if(!id){
      return  res.status(404).json({status:false,message:'Id is required'});  
    }

    const updateRecords = {
        ...req.body, 
    }
    await Vechile_type.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
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