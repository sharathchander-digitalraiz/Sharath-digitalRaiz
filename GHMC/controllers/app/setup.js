const zones = require('../../model/zones'); 
const user =require("../../model/users");
const useraccess=require("../../model/useraccess");
const circle=require("../../model/circles");
const wards=require("../../model/wards");
const area=require("../../model/area");
const Landmarks = require("../../model/landmarks");
const mongoose = require('mongoose'); 
var ObjectId = mongoose.Types.ObjectId;

exports.zones_list = async(req,res)=>
{
    const user_id=req.body.user_id;
    const users = await user.findOne({_id:user_id},{user_access_id:1,_id:0,department_name:1}).exec(); 
   
    let object={};
    if(users.department_name!='Admin')
    {
       const user_access = await useraccess.findOne({_id:users.user_access_id}).exec(); 
        object._id=user_access.zones;
    }
    
    const zonelist = await zones.find(object,{_id:0,id:"$_id",name:1}).exec();
    return res.status(200).json({success:true,login:true,message:'Successfully completed',data:zonelist});   
}  


exports.wards_list = async(req,res)=>
{
  console.log(req.body); 
    const user_id=req.body.user_id;
    const circle_id=req.body.circle_id;
    if(circle_id != 'All'){
    let object={};
    const users = await user.findOne({_id:user_id},{user_access_id:1,_id:0,department_name:1}).exec(); 
    const user_access = await useraccess.findOne({_id:users.user_access_id}).exec(); 
    if(users.department_name!="Admin")
    {
        object._id=user_access.ward;
    }
    object.circles_id=circle_id;
    const wardslist = await wards.find(object,{_id:0,id:"$_id",name:1}).exec();
    //const wardslist = await wards.find({circles_id:circle_id},{_id:0,id:"$_id",name:1}).exec();
    return res.status(200).json({success:true,login:true,message:'Successfully completed',data:wardslist});  
    }else{
      const users = await user.findOne({_id:user_id},{user_access_id:1,_id:0}).exec(); 
      const user_access = await useraccess.findOne({_id:users.user_access_id}).exec();  
      const wardslist = await wards.find({_id:user_access.ward},{_id:0,id:"$_id",name:1}).exec();
      //const wardslist = await wards.find({circles_id:circle_id},{_id:0,id:"$_id",name:1}).exec();
      let ward_details =[];
      wardslist.map((val)=>{
        ward_details.push(val);
      })
      return res.status(200).json({success:true,login:true,message:'Successfully completed',data:ward_details}); 

    } 
} 

exports.circle = async(req,res)=>
{
    console.log("req.body");
    console.log(req.body);
    const zone_id=req.body.zone_id;
    const user_id=req.body.user_id;
    console.log("hello");
    if(zone_id != 'All')
    {
         let object={};
        const users = await user.findOne({_id:user_id},{user_access_id:1,_id:0,department_name:1}).exec(); 
        const user_access = await useraccess.findOne({_id:users.user_access_id}).exec(); 
         if(users.department_name!="Admin")
        {
            object._id=user_access.circles;
        }
        object.zones_id=zone_id;
        const circlelist = await circle.find(object,{_id:0,id:"$_id",name:1}).exec();
        return res.status(200).json({success:true,login:true,message:'Successfully completed',data:circlelist});   
    }
    else
    {
    const users = await user.findOne({_id:user_id},{user_access_id:1,_id:0}).exec(); 
    const user_access = await useraccess.findOne({_id:users.user_access_id}).exec(); 
    const circlelist = await circle.find({_id:user_access.circles},{_id:0,id:"$_id",name:1}).exec();
    let circle_details =[];
    circlelist.map((val)=>{
      circle_details.push(val);
    })
    return res.status(200).json({success:true,login:true,message:'Successfully completed',data:circle_details}); 
    }
} 

exports.area = async(req,res)=>
{
    const ward_id=req.body.ward_id;
    console.log(req.user.user_id);
    console.log("req.user");
    let newobject = {}; 
    const users = await user.findOne({_id:req.user.user_id},{user_access_id:1,_id:0,department_name:1}).exec(); 
    const user_access = await useraccess.findOne({_id:users.user_access_id}).exec(); 
    //  newobject.tenent_id = ObjectId('618f8d2f7bf1ba171f8f35da');
    console.log(users); 
    if(users.department_name=="Admin" || users.department_name=="Zonal Commissioner")
    {
      if(ward_id != 'All'){
      newobject.wards_id=ward_id;
      }
    }
    else
    {
      if(ward_id != 'All'){
         newobject.wards_id=ward_id;
      }
      newobject._id=user_access.areas;
    }
  
  
   // console.log(user_access);
    const arealist = await area.find(newobject,{_id:0,id:"$_id",name:1}).exec();
  //  const arealist = await area.find({wards_id:ward_id},{_id:0,id:"$_id",name:1}).exec();
     let area_details = []; 
     let not_all = []; 
     if(ward_id == 'All'){
      arealist.map((val)=>{
        area_details.push(val); 
      })
     }else{
      arealist.map((val)=>{
        not_all.push(val); 
      })
     }
     if(ward_id == 'All'){
    return res.status(200).json({success:true,login:true,message:'Successfully completed',data:area_details});   
     }else{
      return res.status(200).json({success:true,login:true,message:'Successfully completed',data:not_all});   
     }
} 

exports.getareawiselandmark = async(req,res)=>{
    const a_id = req.body.area_id;
  //  console.log(a_id);
    const allarealandmarks = await Landmarks.aggregate(  
        [  
            {
              $match : {area_id:{$in:[ObjectId(a_id)]}}
              },
             { $project : {   
                                _id:0,
                                id:"$_id",  
                                name : { $concat: [ "$landmark_from", " - ", "$landmark_to" ] },   
                              }  
          }  
        ]  
      ).exec();  
 
      return res.status(200).json({success:true,login:true,message:'Successfully completed',data:allarealandmarks});   
} 