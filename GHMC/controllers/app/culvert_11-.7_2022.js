const zones = require('../../model/zones'); 
const user =require("../../model/users");
const useraccess=require("../../model/useraccess");
const circle=require("../../model/circles");
const wards=require("../../model/wards");
const area=require("../../model/area");
const culvert=require("../../model/culvert");
const culvert_type=require("../../model/culvert_type");
const culvert_issues=require("../../model/culvertissue");
const culvertSolved=require("../../model/culvertsolved");
const Str = require('@supercharge/strings');
const mongoose = require('mongoose'); // or ObjectID
const QRCode=require('qrcode');
const ObjectId = mongoose.Types.ObjectId;
var fs   = require('fs');
const mkdirp=require("mkdirp");
var multer = require('multer');
const { createCanvas, loadImage } = require('canvas');
const User    = require('../../model/users'); 
const Department = require('../../model/department'); 
exports.add_culvert = async(req,res)=>
{
    const user_id=req.body.user_id;
    const zone_id=req.body.zone_id;
    const circle_id=req.body.circle_id;
    const ward_id=req.body.ward_id;
    const landmark=req.body.landmark;
    const latittude=req.body.latittude;
    const longitude=req.body.longitude;
    const location=req.body.location;
    const areas=req.body.area;
    const type=req.body.type;
    const name=req.body.name;
    const depth=req.body.depth;
    const zonelist = await zones.findOne({_id:zone_id},{_id:0,id:"$_id",name:1}).exec();
    const circlelist = await circle.findOne({_id:circle_id},{_id:0,id:"$_id",name:1}).exec();
    const wardslist = await wards.findOne({_id:ward_id},{_id:0,id:"$_id",name:1}).exec();
    const arealist = await area.findOne({_id:areas},{_id:0,id:"$_id",name:1}).exec();

    const qr_code_image_path='images/qr-images/culvert/qr_codes/';
  //  const qr_code_image_path='/home/iotroncs/ghmcapi.iotroncs.co.in/uploads/qr-images/culvert/qr_codes/';
    const template_image_path='images/qr-images/culvert/templates/';
  //  var template_image_path='/home/iotroncs/ghmcapi.iotroncs.co.in/uploads/qr-images/culvert/templates/';

    var circles=circlelist.name.replace(' ', '-');
    fs.mkdir(qr_code_image_path +circles, function(err) {})
    fs.mkdir(template_image_path +circles, function(err) {})
 
  const place={};
  place.type='Point';
  place.coordinates=[];
  place.coordinates.push(longitude);
  place.coordinates.push(latittude);
  var unique_no=await module.exports.generate();

    const cuv = new culvert({
      user_id:user_id,
	    created_by:user_id,
	    zone_id:zone_id,
	    circle_id:circle_id,
      ward_id:ward_id,
	    landmark:landmark,
      area_id:areas,
	    area:arealist.name,
	    zone:zonelist.name,
	    circle:circlelist.name,
	    ward:wardslist.name,
	    type:type,
      latittude:latittude,
	    longitude:longitude,
	    location:location,
	    name:name,
	    depth:depth,
	    status:'Active',
	    date:Date.now(),
	    unique_no:unique_no,
      qr_image:unique_no,
      qr_code_view:unique_no,
      place:place});
      cuv.save(async (error, user) =>
      {
          if(error) 
           res.status(400).json({success: true,login: true,message: error});
          if(user) 
          {
         //   console.log(user);
      
/******************************QRCODE GENERATION****************************************
 * *********************** ****************************************************************
 * ***************************************************************************************/    

 //console.log(user);
 var tunique_no=new String(user._id);
 console.log("tunique_no:"+tunique_no);
 var runique_no=tunique_no.split(':');
 unique_no=await ObjectId(user._id).toString();

 console.log("runique_no:"+runique_no);
 console.log("unique_no:"+unique_no);
 QRCode.toFile(qr_code_image_path+circles+'/'+unique_no+'.png', unique_no, {version: 10},
 function (err)
 {
    console.log(err);
   loadImage("./culvert_template.jpg").then((image) => 
    {
         context.drawImage(image, 0, 0, 1152, 1920);
         const buffer =canvas.toBuffer('image/png');
         fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
         context.drawImage(image, 0, 0);
    });
   const width = 1152;
   const height = 1920;
   const canvas = createCanvas(width, height);
   const context = canvas.getContext('2d');
   context.fillStyle = '#fff';
   context.fillRect(0, 0, width, height);

   const buffer = canvas.toBuffer('image/png')
   fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png", buffer);
   const qr_codes=qr_code_image_path+circles+'/'+unique_no+'.png';
    loadImage(qr_codes).then((image) => 
    {
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(name, 625, 1165);
   
       //  //vehicle type
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(name, 625, 1275);
           //vehicle registeration no
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(arealist.name, 625, 1385);
       //  //location
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(landmark, 625, 1475);
       //  //ward
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(wardslist.name, 625, 1565);
       //  //circle
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(circles, 625, 1655);
       //  //zone
     context.fillStyle = "#000";
     context.font = "45px cambria";
     context.textAlign = "left";
     context.fillText(zonelist.name, 625, 1735);
     context.drawImage(image,75, 210, 980, 980);
     const buffer =canvas.toBuffer('image/png');
     fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
     context.drawImage(image, 0, 0);
    }); 
 
   });
     var re= await culvert.updateOne({_id:user._id},{
        unique_no : unique_no,
        qr_image:"images/qr-images/culvert/templates/"+circles+"/"+unique_no+'.png',
        qr_code_view:"images/qr-images/culvert/templates/"+circles+"/"+unique_no+'.png'
        });

/******************************END QRCODE GENERATION****************************************
 * *********************** ****************************************************************
 * ***************************************************************************************/            

            responseObject = {success: true,login: true,message: 'Saved successfully'}
            res.status(200).json(responseObject);
          }
        
      }); 

}  
exports.generate = async (req, res) =>  
{
    const string = Str.random(25); 
    const checkstring=await culvert.findOne({unique_no:string},{ _id: 1}).countDocuments(); 
    if(checkstring==0)
    {
       return  string;
    }
    else
    {
        module.exports.generate();
    }
}
exports.update_culvert = async(req,res)=>
{
  console.log("updateCulvert");
    const id=req.body.id;
    const user_id=req.body.user_id;
    const zone_id=req.body.zone_id;
    const circle_id=req.body.circle_id;
    const ward_id=req.body.ward_id;
    const landmark=req.body.landmark;
    const latittude=req.body.latittude;
    const longitude=req.body.longitude;
    const location=req.body.location;
    const areas=req.body.area;
    const type=req.body.type;
    const name=req.body.name;
    const depth=req.body.depth;
    const zonelist = await zones.findOne({_id:zone_id},{_id:0,id:"$_id",name:1}).exec();
    const circlelist = await circle.findOne({_id:circle_id},{_id:0,id:"$_id",name:1}).exec();
    const wardslist = await wards.findOne({_id:ward_id},{_id:0,id:"$_id",name:1}).exec();
    const arealist = await area.findOne({_id:areas},{_id:0,id:"$_id",name:1}).exec();

    const qr_code_image_path='images/qr-images/culvert/qr_codes/';
    var template_image_path='images/qr-images/culvert/templates/';

    var circles=circlelist.name.replace(' ', '-');
    fs.mkdir(qr_code_image_path +circles, function(err) {})
    fs.mkdir(template_image_path +circles, function(err) {})

    const crows = await culvert.findOne({_id:id}).exec();
    var unique_no=crows.unique_no;
QRCode.toFile(qr_code_image_path+circles+'/'+unique_no+'.png', unique_no, {version: 10},
function (err)
{
  console.log(err);
  loadImage("./culvert_template.jpg").then((image) => 
   {
      context.drawImage(image, 0, 0, 1152, 1920);
      const buffer =canvas.toBuffer('image/png');
      fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
      context.drawImage(image, 0, 0);
   });
  const width = 1152;
  const height = 1920;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png", buffer);
  const qr_codes=qr_code_image_path+circles+'/'+unique_no+'.png';
  
   loadImage(qr_codes).then((image) => 
   {
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    context.fillText(name, 625, 1165);
  
      //  //vehicle type
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    //context.fillText(type, 625, 1275);
    context.fillText(name, 625, 1275);
          //vehicle registeration no
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    context.fillText(arealist.name, 625, 1385);
      //  //location
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    context.fillText(landmark, 625, 1475);
      //  //ward
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    context.fillText(wardslist.name, 625, 1565);
      //  //circle
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    context.fillText(circles, 625, 1655);
      //  //zone
    context.fillStyle = "#000";
    context.font = "45px cambria";
    context.textAlign = "left";
    context.fillText(zonelist.name, 625, 1735);
    context.drawImage(image,75, 210, 980, 980);
    const buffer =canvas.toBuffer('image/png');
    fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
    context.drawImage(image, 0, 0);
   });
  });

  const save_vehicles = await culvert.updateOne({_id:id},{
    user_id:user_id,
	    zone_id:zone_id,
	    circle_id:circle_id,
      ward_id:ward_id,
	    landmark:landmark,
      area_id:areas,
	    area:arealist.name,
	    zone:zonelist.name,
	    circle:circlelist.name,
	    ward:wardslist.name,
	    type:type,
      latittude:latittude,
	    longitude:longitude,
	    location:location,
	    name:name,
	    depth:depth,
	    status:'Active',
	    date:Date.now(),
	    unique_no:unique_no,
      qr_image:qr_code_image_path+circles+"/"+unique_no+'.png',
      qr_code_view:template_image_path+circles+"/"+unique_no+'.png',
      log_date_modified:Date.now(),
      modified_by:user_id
    },(err,data)=>
     {
       if(err)
       {   
         responseObject = {success: false,login: true,message: 'Something went wrong please try again'}
         res.status(400).json(responseObject);
       }
       else if(data == null)
       {
           responseObject = {success: false,login: true,message: 'Sorry unable to update culvert'}
           res.status(400).json(responseObject);
       }
       else if(data)
       {
         responseObject = {success: true,login: true,message: 'Updated Successfully'}
         res.status(200).json(responseObject);
       } 
   }) 
}  

exports.editculvert = async (req, res) =>  
{
  const {id} = req.body;
  const data = await culvert.findOne({_id:id}).exec();
  if(data._id!="")
  {
        responseObject = {success: true,login: true,message: 'Successfully Completed',data:data}
        res.status(200).json(responseObject);
  }
  else
  {
    responseObject = {success: false,login: true,message: 'invalid id'}
    res.status(200).json(responseObject);
  }
};



exports.deleteculvert = async (req, res) =>  
{
  const {id} = req.body;
  const data = await culvert.findOne({_id:id}).countDocuments();
  if(data!="0")
  {
    culvert.findByIdAndRemove({_id:id}, 
      function(err, docs)
      {
        if(err)
        {
          responseObject = {success: false,login: true,message: 'Something went wrong please try again'}
          res.status(400).json(responseObject);
        }
        else   
        {
          responseObject = {success: true,login: true,message: 'Deleted Successfully'}
          res.status(200).json(responseObject);
        }
   });
  }
  else
  {
    responseObject = {success: true,login: true,message: 'Invalid Id'}
    return res.status(200).json(responseObject);
  }
};

exports.getCulvert = async (req, res) =>  
{
const {tenent_id,user_id}=req.body;
let acc_dep_data = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
let condition={};
condition.status='Active';
if(role_data.name!='admin')
{
  const access_data = await useraccess.findOne({_id:acc_dep_data.user_access_id}).exec();
  condition.circle_id=access_data['circles'];
}
const data = await culvert.find(condition).exec();
responseObject = {'success':true,login: true,message:'Sucessfully completed','data':data};
res.status(200).json(responseObject);
}

exports.getallissues_zone_culvert=async (req, res) =>
{
 const {user_id} = req.body;
 const users_data = await user.findOne({_id:user_id}).exec();
 const useraccess_data = await useraccess.findOne({_id:users_data.user_access_id}).exec();
 //const culvert_issues_data = await culvert_issues.find({circle_id:useraccess_data.circles}).exec();
 const culverts_issues_data = await culvert_issues.aggregate([ 
        {
          $lookup:{
              from: "culverts",       // other table name
              localField: "culvert_id",   // name of users table field
              foreignField: "_id", // name of userinfo table field
              as: "culvert"         // alias for userinfo table
          }   
      }, {   $unwind:"$culvert"},
      {   
           $lookup:{
               from: "culvert_types",       // other table name
               localField: "isse_type_id",   // name of users table field
              foreignField: "_id", // name of userinfo table field
              as: "issue_types"         // alias for userinfo table
          } 
       },// define which fields are you want to fetch  
       {   $unwind:"$issue_types" },
      {   
          $project:{ 
              _id:0,
              id:"$_id",
              date:1,
              issue_name:1,
              culvert_id:1,
              depth:"$culvert.depth",
              issue_depth : 1,
              type : "$issue_types.name", 
              image : 1,     
              status : 1,   
              landmark : 1,               
              area : 1,  
              ward : 1, 
              circle : 1, 
              zone : 1,
              solved_image:1
            }  
          }
    ]).exec(); 
    console.log(culverts_issues_data);
 responseObject = {'success':true,login: true,message:'Sucessfully completed','data':culverts_issues_data};
 res.status(200).json(responseObject);
}

exports.getCulvertissue_type = async (req, res) =>  
{
const data = await culvert_type.find({status:'Active'},{_id:0,name:1,status:1,id:"$_id"}).exec();
responseObject = {'success':false,login: true,message:'Sucessfully completed','data':data};
res.status(200).json(responseObject);
}



exports.culvertissue = async (req, res) =>  
{
const {culvert_id,user_id,isse_type_id,depth} = req.body;
console.log(req.body);
const culvert_data = await culvert.findOne({_id:culvert_id}).exec();
const culvert_type_data = await culvert_type.findOne({status:'Active',_id:isse_type_id}).exec();
console.log(culvert_type_data.name);
var type='';
var check="";
console.log(culvert_type_data.name);
var tname = culvert_type_data.name.trim();
console.log("culvert_type_data");
if(tname==' Normal Flow' || tname=="Normal Flow")
{
  type='green';
}
else if(tname=="Water OverFlow")
{
  check=(depth/culvert_data.depth)*100;
  console.log(check);
  console.log(culvert_type_data.depth);
  if(check <= '50')
  {
    type='green';
  }
  else if(check <= '75' && check >='50')
  {
    type='orange';
  }
  else if(check >= '75' && check <= '100')
  {
    type='red';
  }
}
else if(tname=="Drinage blockage")
{
   type='red';
}
console.log(type);
let current_datetime = new Date();
let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate();
const cuv_issue = new culvert_issues({
  issue_name:culvert_type_data.name,
  isse_type_id:isse_type_id,
  culvert_id:culvert_id,
  issue_depth:depth,
  type:type,
  date:formatted_date,
  time:'',
  image:req.file.path,
  zone_id:culvert_data.zone_id,
  circle_id:culvert_data.circle_id,
  ward_id:culvert_data.ward_id,
  landmark:culvert_data.landmark,
  area_id:culvert_data.area_id,
  area:culvert_data.area,
  zone:culvert_data.zone,
  circle:culvert_data.circle,
  ward:culvert_data.ward,
  status:"pending",
  user_id:user_id,
  created_by:user_id,
  log_date_created:Date.now(),
  });
  cuv_issue.save((error, user) =>
  {
      if(error)  res.status(400).json({success: true,login: true,message:error});
      if(user) 
      {
        responseObject = {'success':true,login: true,message:'Culvert  Issue Created Successfully'};
        res.status(200).json(responseObject);
      }
    
  });
}


exports.culvertsolved = async (req, res) =>  
{
  console.log("req");
const {culvert_id,user_id,culvert_issue_id,latitude,longitude,status} = req.body;
let longitude1 = parseFloat(longitude);  
let latittude1 = parseFloat(latitude);  
//const culvert_type_rows = await culvert.find({place:{$near:{$geometry:{ type: "Point", coordinates: [longitude1,latittude1] },$maxDistance:50}},_id:culvert_id}).exec();
const culvert_type_rows = await culvert.find({_id:culvert_id}).exec();

if(culvert_type_rows.length>0)
{
  let current_datetime = new Date();
   var formatted_date= current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate();

   let hours = current_datetime.getHours();
// current minutes
  let minutes = current_datetime.getMinutes();
  // current seconds
    let seconds = current_datetime.getSeconds();
    var time = hours+":"+minutes+":"+seconds;
  console.log(req.file);
    const cuv_issue = new culvertSolved({
      culvert_id:culvert_id,
      culvert_issue_id:culvert_issue_id,
      image:req.file.path,
      date:formatted_date,
      time:'',
      user_id:user_id,
      status:status,
      resolved_color:'green',
      created_by:user_id,
      log_date_created:Date.now(),
      log_date_modified:Date.now(),
      modified_by:user_id,
      longitude:longitude,
      latitude:latitude
      });
      cuv_issue.save(async (error, user) =>
      {
        if(error)  res.status(400).json({success: true,login: true,message:error});
        const cuv_issueUpdate = await culvert_issues.updateOne({_id:culvert_issue_id}, {
                                    solved_date:formatted_date,
                                    solved_time:"",
                                    solved_color:'green',
                                    solved_image:req.file.path,
                                    user_id:user_id,
                                    status:status,
                                    modified_by:user_id
                  }
                  ,(err,data)=>
                  {
                      if(err)  res.status(400).json({success: true,login: true,message:"Something Went wrong.please try again"});
                      if(data) 
                      {
                        responseObject = {'success':true,login: true,message:'Culvert  Solved Submitted Successfully'};
                        res.status(200).json(responseObject);
                      }
                    
                  });
     });
}
else
{
  responseObject = {'success':false,login: true,message:"Allow only in location"};
  res.status(400).json(responseObject);
}

}

var storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/culvert/')
  },
  filename: (req, file, cb) => 
  {
    cb(null,  Date.now() + '-' + file.originalname)
  }
});

exports.upload = multer({storage: storage});