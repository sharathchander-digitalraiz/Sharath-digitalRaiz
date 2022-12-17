const vehicles = require('../../model/vehicles'); 
const users =require('../../model/users');
const department = require('../../model/department'); 
const useraccesses = require('../../model/useraccess'); 
const mongo = require('mongodb');
const pwdhash = require('node-php-password');
const tenent=require("../../model/tenent");
const zone=require("../../model/zones");
const circle=require('../../model/circles');
const wards = require('../../model/wards');
const landmark=require("../../model/landmarks");
const area_s = require('../../model/area'); 
const Str = require('@supercharge/strings');
var multer=require("multer");

const owner = require("../../model/ownertype");
const vehicle_type = require("../../model/vechile_type");

const { createCanvas, loadImage } = require('canvas');

const QRCode=require('qrcode');
//const helper=require("../../services/services"); qr_code_view: qrc,
var fs   = require('fs');
var path = require('path');
var gd   = require('node-gyp');
var source = './test.png';
var target = './filename.png';

exports.getVehicles = async (req, res) =>  
{
const data = await vehicles.find({status:'Active'},
{sfa_id:1, _id: 1,zone: 1,circle_no:1,circle: 1,wards_no:1,ward_name:1,
     area:1,location:1,owner_type:1,vehicle_type:1,vehicle_registration_number:1,driver_name:1,driver_number:1,
     incharge:1,incharge_mobile_number:1,transfer_station:1,qr_code_view:1,
     log_date_modified:1,qr_code_view:1,image:1}).sort({_id:-1}).exec();
   //  console.log(data);
responseObject = {'success':true,login: true,message:'Sucessfully completed','data':data};

res.status(200).json(responseObject);
}



exports.updatevehicles = async (req, res) => {
    const { id,user_id, zone_id, circle_id, ward_id,area_id, land_mark_id, owner_type_id, vechile_type_id, reg_no, sfa_name, sfa_mobile, driver_name,
      driver_mobile, transfer_station_id, area,sfa_id } = req.body;
      const vehicles_row = await vehicles.findOne({ _id: id }).exec();
      const zonerow = await zone.find({ _id: zone_id}, {_id: 1, name: 1,tenent_id:1 }).exec();
      const circlerow = await circle.find({ _id: circle_id }, { _id: 1, name: 1,circle_no:1 }).exec();
      const wardsrow = await wards.find({ _id: ward_id }, { _id: 1, name: 1,wards_no:1 }).exec();
      const areasrow = await area_s.find({ _id: area_id }, { _id: 1, name: 1 }).exec();
      const landmarkrow = await landmark.findOne({ _id: land_mark_id }, { _id: 1,landmark_from: 1,landmark_to: 1}).exec();
      const usersrow = await users.find({ _id: sfa_id }).exec();
      const ownerrow = await owner.find({ _id: owner_type_id }, { _id: 1, name: 1 }).exec();
      const transfer_station_row = await users.find({ _id: transfer_station_id }).exec();
      const vehicle_type_row = await vehicle_type.find({ _id: vechile_type_id }).exec();
      var unique_no = vehicles_row.unique_no;
      console.log("hello");

      /**********************                    ********************************************************************************
       * ********************Qrcode generation************************************************************************************
       * *************************************************************************************************************************/
      const qr_code_image_path = 'images/qr-images/vehicle/qr_codes/';
      var template_image_path = 'images/qr-images/vehicle/templates/';
      var circles = circlerow[0].name.replace(' ', '-');
      fs.mkdir(qr_code_image_path + circles, function (err) { })
      fs.mkdir(template_image_path + circles, function (err) { })

          loadImage("./template.png").then((image) => {
            context.drawImage(image, 0, 0, 1152, 1920);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
            context.drawImage(image, 0, 0);
          });
          const width = 1152;
          const height = 1920;
          const canvas = createCanvas(width, height);
          const context = canvas.getContext('2d');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, width, height);
  
  
          const buffer = canvas.toBuffer('image/png')
          fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
          const qr_codes = qr_code_image_path + circles + '/' + unique_no + '.png';

          QRCode.toFile(qr_code_image_path + circles + '/' + unique_no + '.png', unique_no, { version: 10 },
          function (err) {
          loadImage(qr_codes).then((image) => {
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(ownerrow[0].name, 625, 1165);
  
            //  //vehicle type
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(vehicle_type_row[0].name, 625, 1275);
  
            //vehicle registeration no
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(reg_no, 625, 1385);
  
            //  //location
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(landmarkrow.landmark_from, 625, 1475);
            //  //ward
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(wardsrow[0].name, 625, 1565);
            //  //circle
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(circlerow[0].name, 625, 1655);
            //  //zone
            context.fillStyle = "#000";
            context.font = "45px cambria";
            context.textAlign = "left";
            context.fillText(zonerow[0].name, 625, 1735);
            context.drawImage(image, 260, 510, 580, 580);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
            context.drawImage(image, 0, 0);
          });
        });
        /***********                     ******************************
       * ***********END QRCODE GENERATION*******************************
       *************************************************************/
      const qrc =template_image_path + circles + '/' + unique_no + ".png";
      console.log("qrc");
      console.log(qrc);
      const vehicle_image=(req.file)?"images/vehicle/images/"+req.file.filename:vehicles_row.image;
      const save_vehicles = await vehicles.updateOne({_id:id},{
        image:vehicle_image,
        zone: zonerow[0].name,
        circle_no: circlerow[0].circle_no,
        circle: circlerow[0].name,
        area_name:areasrow[0].name,
        wards_no: wardsrow[0].wards_no, ward_name: wardsrow[0].name,
        location: landmarkrow.landmark_from + '-'+landmarkrow.landmark_to,
        incharge: usersrow[0].first_name + '-' + usersrow[0].last_name,
        incharge_mobile_number: usersrow[0].mobile_number,
        vehicle_registration_number: reg_no,
        owner_type_id:owner_type_id,
        owner_type: ownerrow[0].name, driver_name: driver_name, driver_number: driver_mobile,
        transfer_station: transfer_station_row[0].first_name + '-' + transfer_station_row[0].last_name,
        transfer_station_id:transfer_station_id,
        area_id:area_id,
        qr_code_view: qrc, tenent_id: zonerow[0].tenent_id, zones_id: zone_id, circles_id: circle_id,
        ward_id: ward_id, landmark_id: land_mark_id, vehicle_type_id: vechile_type_id,
         vehicle_type: vehicle_type_row[0].name,modified_by: req.user.user_id,sfa_id:sfa_id
        },(err,data)=>
         {
           if(err)
           {   
             responseObject = {success: false,login: true,message: 'Something went wrong please try again'}
             res.status(400).json(responseObject);
           }else if(data == null)
           {
               responseObject = {success: false,login: true,message: 'Sorry unable to update Vehicle'}
               res.status(400).json(responseObject);
           }
           else if(data)
           {
             responseObject = {success: true,login: true,message: 'Updated Successfully'}
             res.status(200).json(responseObject);
           } 
       }) 
  }
  

exports.editvehicles = async (req, res) =>  
{
  const {id} = req.body;
console.log(req.body);
  const data = await vehicles.findOne({_id:id}).exec();
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



exports.deleteVehicles = async (req, res) =>  
{
  const {id} = req.body;
  const datas = await vehicles.findOne({_id:id}).exec();
 // console.log(datas);
  const data = await vehicles.findOne({_id:id}).countDocuments();
  if(data!="0")
  {
   // vehicles.findByIdAndRemove({_id:id}, 
    vehicles.updateOne({_id:id},{status:"Inactive"},(err,data)=>
      {
       //   console.log("err");
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
exports.generate = async (req, res) =>  
{
    const string = Str.random(25); 
    console.log(string);
    const checkstring=await vehicles.findOne({unique_no:string},{ _id: 1}).countDocuments(); 
    if(checkstring==0)
    {
       return  string;
    }
    else
    {
        module.exports.generate();
    }
}

var storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/vehicle/images/')
  },
  filename: (req, file, cb) => 
  {
    cb(null,  Date.now() + '-' + file.originalname)
  }
});

exports.vehicle_upload = multer({storage: storage});