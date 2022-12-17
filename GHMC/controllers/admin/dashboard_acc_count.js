const Zones = require('../../model/zones');
const Circles = require('../../model/circles');
const Wards = require('../../model/wards');
const Areas = require('../../model/area');
const Landmarks = require('../../model/landmarks'); 
const User = require('../../model/users');
const User_access = require('../../model/useraccess'); 
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.admin_access_dashboard = async(req,res)=>{
    const user_details = req.user.user_id;
    const user_acc_id = await User.findOne({_id:user_details},{user_access_id:1}).exec();
    const all_details = await User_access.findOne({_id:user_acc_id.user_access_id},{zones:1,circles:1,ward:1,areas:1,landmarks:1}).exec();
    const zones_count = await Zones.find({_id:[all_details.zones]}).countDocuments(); 
    const circle_count = await Circles.find({_id:all_details.circles}).countDocuments(); 
    const ward_count = await Wards.find({_id:all_details.ward}).countDocuments(); 
    const area_count = await Areas.find({_id:all_details.areas}).countDocuments(); 
    const land_count = await Landmarks.find({_id:all_details.landmarks}).countDocuments();
    const finaldata ={ zones_count,circle_count,ward_count,area_count,land_count }
    return res.status(200).send({login:true,status:true,data:finaldata }); 
}

exports.circleacc = async(req,res)=>{
    const user_details = req.user.user_id;
    const user_acc_id = await User.findOne({_id:user_details},{user_access_id:1}).exec();
    const circle_details = await User_access.findOne({_id:user_acc_id.user_access_id},{circles:1}).exec();
    const circle_final_details = await Circles.find({_id:circle_details.circles},{_id:0,id:"$_id",name:1}).exec(); 
    return res.status(200).send({login:true,status:true,data:circle_final_details })
}

exports.wardacc = async(req,res)=>{
    const user_details = req.user.user_id;
    const user_acc_id = await User.findOne({_id:user_details},{user_access_id:1}).exec();
    const ward_details = await User_access.findOne({_id:user_acc_id.user_access_id},{ward:1}).exec();
    console.log(ward_details); 
    const ward_final_details = await Wards.find({_id:ward_details.ward},{_id:0,id:"$_id",name:1}).exec(); 
    return res.status(200).send({login:true,status:true,data:ward_final_details })
}

exports.areaacc = async(req,res)=>{
    const user_details = req.user.user_id;
    const user_acc_id = await User.findOne({_id:user_details},{user_access_id:1}).exec();
    const area_details = await User_access.findOne({_id:user_acc_id.user_access_id},{areas:1}).exec();
    const area_final_details = await Areas.find({_id:area_details.areas},{_id:0,id:"$_id",name:1}).exec(); 
    return res.status(200).send({login:true,status:true,data:area_final_details })
}

exports.landmarkacc = async(req,res)=>{
    const user_details = req.user.user_id;
    const user_acc_id = await User.findOne({_id:user_details},{user_access_id:1}).exec();
    const land_details = await User_access.findOne({_id:user_acc_id.user_access_id},{landmarks:1}).exec();
    const land_final_details = await Landmarks.find({_id:land_details.landmarks},{_id:0,id:"$_id",landmark_from:1}).exec(); 
    return res.status(200).send({login:true,status:true,data:land_final_details })
}


