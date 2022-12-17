var multer      = require('multer');   
var excelToJson = require('convert-excel-to-json');    
var fs=require("fs");
const vehicle=require("../../model/vehicles");
const owner_types=require("../../model/ownertype");
const User=require("../../model/users");
const zones=require("../../model/zones");
const circles=require("../../model/circles");
const wards=require("../../model/wards");
const landmark=require("../../model/landmarks");
const areas=require("../../model/area");
const vehicleType=require("../../model/vechile_type");
const Str = require('@supercharge/strings');
const QRCode = require('qrcode');
var fs = require('fs');
const mkdirp = require("mkdirp");
var multer=require("multer");
const { createCanvas, loadImage,registerFont } = require('canvas');
exports.import_data_vehicles = async (req, res) =>  
{
  const {user_id}=req.body;
  importExcelData2MongoDB('./uploads/excel/family/' + req.file.filename,user_id);
  responseObject = {'success':true,login: true,message:'Successfully Completed'};
  res.status(200).json(responseObject);
}    
// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath,user_id)
{
  console.log(filePath);
// -> Read Excel File to Json Data
const excelData = excelToJson({ 
sourceFile: filePath,
sheets:[{
// Excel Sheet Name
name: 'Total', 
// Header Row -> be skipped and will not be present at our result object.
header:{
rows: 1
},
// Mapping columns to keys
columnToKey: {
    A: 'zone',
    B: 'circle',
    C: 'ward',
    D: 'area',
    E: 'landmark',
    F: 'owner_type',
    G: 'vehicle_type',
    H: 'registeration_number',
    I: 'sfa_name',
    J: 'sfa_mobile_number',
    K: 'driver_name',
    L: 'driver_mobile_number',
    M: 'transfer_station'
}
}]
});
// -> Log Excel Data to Console
 //console.log(excelData);
var i=0;
const docs=[];
await Promise.all(excelData.Total.map( async(element,dind)=>  
{
       const zonerow = await zones.findOne({ name: element.zone}, {}).exec(); 
       console.log(zonerow); 
       const circlerow = await circles.findOne({ name: element.circle}, {}).exec();
       console.log(circlerow);
       const wardrow = await wards.findOne({ name: element.ward}, {}).exec();
       console.log(wardrow); 
       const landmarkrow = await landmark.findOne({ landmark_from: element.landmark}, {}).exec();
       console.log(landmarkrow);
       const arearow = await areas.findOne({ name: element.area}, {}).exec();
       console.log(arearow);
       var d = new Date();
       var curr_date = d.getDate();
       var curr_month = d.getMonth() + 1; //Months are zero based
       
       var curr_year = d.getFullYear();
       if(curr_month>10)
       {
         curr_month=curr_month;
       }
       else
       {
         curr_month='0'+curr_month;
       }
       let vehicleRegNumber = element.registeration_number.trim();
       const documents = await vehicle.findOne({ vehicle_registration_number: vehicleRegNumber }, {_id: 1,tenent_id:1 }).countDocuments(); 
       const ownerData = await owner_types.findOne({name:element.owner_type.trim()}, {}).exec(); 
       const vehicleTypeData = await vehicleType.findOne({name:element.vehicle_type.trim()}, {}).exec(); 
       const userDocuments = await User.findOne({ mobile_number: element.sfa_mobile_number }, {_id: 1,tenent_id:1 }).countDocuments();
       const transfer_stationdata = await User.findOne({$or:[{"first_name":element.transfer_station},
       {"last_name":element.transfer_station}]}, {_id: 1}).exec();
       if(userDocuments==0)
       {
         const drow = await department.findOne({name:'Sfa',tenent_id:zonerow.tenent_id},{ _id: 1,name: 1}).exec();
         const Cuser = new User({
          first_name: element.sfa_name,
          last_name: 'Sfa',
          username: element.sfa_mobile_number,
          department_id:drow._id,
          department_name:drow.name,
          tenent_id:zonerow.tenent_id, 
          password:pwdhash.hash(element.sfa_mobile_number),
          email:'',
          mobile_number:element.sfa_mobile_number,
          status:"Active",
          created_by:user_id,
          user_access_id:"",
          user_access_name:""
        });
        Cuser.save();

       }
       const userData = await User.findOne({mobile_number:element.sfa_mobile_number}, {}).exec(); 
     if(documents == 0)
     {
       docs.push({
          zone: element.zone, 
          circle: element.circle,
          ward_name: element.ward, 
          area:element.area,        
          landmark:element.landmark, 
          owner_type:element.owner_type,   
          owner_type_id:ownerData._id,   
          vehicle_type:element.vehicle_type,
          vehicle_type_id:vehicleTypeData._id,
          registeration_number:element.registeration_number,
          sfa_name:element.sfa_name,
          sfa_mobile_number:element.sfa_mobile_number,
          driver_name:element.driver_name,
          driver_mobile_number:element.driver_mobile_number,
          transfer_station:element.transfer_station,
          zones_id:zonerow._id,
          circles_id:circlerow._id, 
          circlesRow:circlerow, 
          circles_no:circlerow.circle_no, 
          areaRow:arearow, 
          zoneRow:zonerow, 
          wardRow:wardrow, 
          landmarkRow:landmarkrow, 
          ward_id:wardrow._id, 
          landmark_id:landmarkrow._id,
          area_id:arearow._id,
          tenent_id:zonerow.tenent_id,
          user_id:userData._id,
          userRow:userData,
          transfer_staion_id:transfer_stationdata._id,
          transfer_stationRow:transfer_stationdata, 
          vehicleRegNumber:vehicleRegNumber        
      });
     }

   
}))
   console.log(docs);
   await Promise.all(docs.map( async(val,index)=>{


    const qr_code_image_path='images/qr-images/vehicle/qr_codes/';
    var template_image_path='images/qr-images/vehicle/templates/';
console.log(val.circlesRow);
console.log("val.circlesRow");

    var circles = val.circle.replace(' ', '-');
    fs.mkdir(qr_code_image_path + circles, function (err) { })
    fs.mkdir(template_image_path + circles, function (err) { })
    var unique_no = await module.exports.generate();
    
  //   QRCode.toFile(qr_code_image_path+circles+'/'+unique_no+'.png', unique_no, {version: 10},
  // function (err)
  // {
  // loadImage("./template.jpg").then((image) => 
  //  {
  //       context.drawImage(image, 0, 0, 1152, 1920);
  //       const buffer =canvas.toBuffer('image/png');
  //       fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
  //       context.drawImage(image, 0, 0);
  //   });
  //   const width = 698; 
  //   const height = 1280;
  //   const canvas = createCanvas(width, height);
  //   const context = canvas.getContext('2d');
  //   context.fillStyle = '#fff';
  //   context.fillRect(0, 0, width, height);
     
     
  //   const buffer = canvas.toBuffer('image/png')
  //   fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png", buffer);
  //   const qr_codes=qr_code_image_path+circles+'/'+unique_no+'.png';
  //   loadImage(qr_codes).then((image) => 
  //   {
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.owner_type, 435, 807); 
   
  //      //  //vehicle type
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.vehicle_type, 435, 865);
  //          //vehicle registeration no
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.vehicleRegNumber, 435, 915);
  //      //  //location
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.landmark, 435, 968);
  //      //  //ward
  //      //  //circle
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.ward_name, 435, 1068);
  //      //  //zone
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.circle, 435, 1118); 
     
 
  //    context.fillStyle = "#000";
  //    context.font = "28px cambria";
  //    context.textAlign = "left";
  //    context.fillText(val.zone, 435, 1168);
 
 
  //    context.drawImage(image,155, 330, 380, 380); 
  //    const buffer =canvas.toBuffer('image/png');
  //    fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
  //    context.drawImage(image, 0, 0);
  //   });
  //   });


    


    const save_vehicles = new vehicle({
      image:"",
      zone: val.zone,
      circle_no:val.circles_no,
      circle: val.circle, 
      area_name:val.areaRow.name,
      wards_no: val.wardRow.wards_no, ward_name: val.wardRow.name,
      location: val.landmarkRow.landmark_from + '-'+val.landmarkRow.landmark_to,
      incharge: val.userRow.first_name + '-' + val.userRow.last_name,
      incharge_mobile_number: val.userRow.mobile_number, 
      vehicle_registration_number: val.vehicleRegNumber,
      owner_type_id:val.owner_type_id,
      owner_type: val.owner_type,
      driver_name: val.driver_name,
      driver_number: val.driver_mobile_number,
      transfer_station: val.transfer_stationRow.first_name + '-' + val.transfer_stationRow.last_name,
      transfer_station_id:val.transfer_stationRow._id,
      area_id:val.area_id,
      qr_code_view: template_image_path + circles + "/" + unique_no + '.png',
      qr_image: template_image_path + circles + "/" + unique_no + '.png',
      unique_no: unique_no,
      tenent_id: val.tenent_id,
      zones_id: val.zones_id, 
      circles_id:  val.circles_id,
      ward_id:  val.ward_id, 
      landmark_id: val.landmark_id, 
      vehicle_type_id: val.vehicle_type_id, 
      vehicle_type: val.vehicle_type,
      log_date_modified: '',  
      created_by: user_id,
      sfa_id:val.user_id
    });
    //area_id:area_id,
    save_vehicles.save(async (error, user) => {
     console.log(error);
     
     var tunique_no=new String(user._id);
     console.log("tunique_no:"+tunique_no);
     var runique_no=tunique_no.split(':');
     unique_no=await ObjectId(user._id).toString();  

  QRCode.toFile(qr_code_image_path + circles + '/' + unique_no + '.png', unique_no, { version: 10 },
  function (err) {
    loadImage("./template.jpg").then((image) => {
      context.drawImage(image, 0, 0, 1152, 1920);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
      context.drawImage(image, 0, 0);
    });
    const width = 1152;
    const height = 1920;
    registerFont('./fonts/Cambria.ttf', { family:'Cambria'});
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);


    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
    //const qr_codes = "/home/ghmcapp/public_html/ghmc_api/" + qr_code_image_path + circles + '/' + unique_no + '.png';
    const qr_codes = qr_code_image_path + circles + '/' + unique_no + '.png';

    loadImage(qr_codes).then((image) => {
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.owner_type, 625, 1165);

      //  //vehicle type
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.vehicle_type, 625, 1275);

      //vehicle registeration no
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.vehicleRegNumber, 625, 1385);

      //  //location
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.landmark, 625, 1475);
      //  //ward
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.ward_name, 625, 1565);
      //  //circle
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.circle, 625, 1655);
      //  //zone
      context.fillStyle = "#000";
      context.font = '45px ';
      context.textAlign = "left";
      context.fillText(val.zone, 625, 1735);
      context.drawImage(image, 260, 510, 580, 580);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(template_image_path + circles + '/' + unique_no + ".png", buffer);
      context.drawImage(image, 0, 0);
    });

 
     });
     var re= await vehicles.updateOne({_id:user._id},{
      unique_no : unique_no,
      qr_image:"images/qr-images/vehicle/templates/"+circles+"/"+unique_no+'.png',
      qr_code_view:"images/qr-images/vehicle/templates/"+circles+"/"+unique_no+'.png'
      });

    });

  }));

}

        

var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    { 
      cb(null, './uploads/excel/family');     
    },     
    filename: (req, file, cb) =>   
    {    
      cb(null,  Date.now() + '-' + file.originalname);        
    }
});

exports.upload_user_family = multer({storage: storage});
    

exports.generate = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await vehicle.findOne({ unique_no: string }, { _id: 1 }).countDocuments();
  if (checkstring == 0) {
    return string;
  }
  else {
    module.exports.generate();
  }
}