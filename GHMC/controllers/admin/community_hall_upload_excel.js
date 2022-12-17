
const comunityHall=require("../../model/communityhall");
const unique_nos = require('../../model/unique_nos'); 
const zones = require('../../model/zones'); 
const pwdhash = require('node-php-password');
const users = require('../../model/users'); 
const circles = require('../../model/circles'); 
const wards = require('../../model/wards');     
const areas = require('../../model/area');    
const landmark = require('../../model/landmarks'); 
const Str = require('@supercharge/strings'); 
var multer      = require('multer');   
var excelToJson = require('convert-excel-to-json');    
var fs=require("fs");
const QRCode=require('qrcode');  
const { v4: uuidv4 } = require('uuid'); 
const { createCanvas, loadImage } = require('canvas');

exports.import_data_comunityHall = async (req, res) =>  
{
  try {
  const {user_id}=req.body;
  importExcelData2MongoDB('./uploads/excel/' + req.file.filename,user_id);
  responseObject = {'success':true,login: true,message:'Successfully completed'};
  res.status(200).json(responseObject);
} catch (err) {
  res.status(err.status).json({ message: err.message, error: err.error })
}

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
    F: 'business_type',
    G: 'business_name',
    H: 'address',
    I: 'owner_name',
    J: 'owner_mobile',
    K: 'owner_aadhar',
    L: 'licence_type',
    M: 'licence_number',
    N: 'disposal_type',
    O: 'type_community',
    P: 'quantity',
    Q: 'wastage_weight',
    R:'property_number',
    S:'coordinates'
}
}]
});
// -> Log Excel Data to Console
 //console.log(excelData);
var i=0;
const docs=[];
await Promise.all(excelData.Total.map( async(element,dind)=>  
{
       console.log(element.zone);
       const zonerow = await zones.findOne({ name: element.zone.trim()}, {}).exec(); 
       console.log("zonerow"); 
       console.log(zonerow); 
       const circlerow = await circles.findOne({ name: element.circle.trim()}, {}).exec();
       console.log(circlerow);
       const wardrow = await wards.findOne({ name: element.ward.trim()}, {}).exec();
       console.log(wardrow); 
       const landmarkrow = await landmark.findOne({ landmark_from: element.landmark.trim()}, {}).exec();
       console.log(landmarkrow);
       const arearow = await areas.findOne({ name: element.area.trim()}, {}).exec();
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
       var dates=curr_year+'-'+curr_month+'-'+curr_date;
       const place={};
       place.type='Point';
       place.coordinates=[];
       let cor = element.coordinates.split(',')
       place.coordinates.push(Number(cor[0]));
       place.coordinates.push(Number(cor[1]));
      // console.log(place)
    docs.push({
        date: dates,
        zone:zonerow.name, 
        circle:circlerow.name,
        ward_name: wardrow.name, 
        area:arearow.name,        
        landmark:landmarkrow.landmark_from+'-'+landmarkrow.landmark_to,   
        business_type:element.business_type,
        business_name:element.business_name,
        shop_address:element.address,  
        owner_name:element.owner_name,
        owner_mobile:element.owner_mobile,
        owner_aadhar:element.owner_aadhar,
        licence_number:element.licence_number,
        licence_type:element.licence_type,
        disposal_type:element.disposal_type,
        type_community:element.type_community,
        tenent_id:zonerow.tenent_id,
        quantity:element.quantity,
        wastage_weight:element.wastage_weight,
        property_number:element.property_number,
        zones_id:zonerow._id,
        circles_id:circlerow._id, 
        ward_id:wardrow._id, 
        landmark_id:landmarkrow._id,
        area_id:arearow._id,
        user_id:user_id,
        place:place,
        image:''        
    });

   
}))
   console.log(docs);
   await Promise.all(docs.map( async(val,index)=>{

    const qr_code_image_path='uploads/qr-images/community_hall/qr_codes/';
    var template_image_path='uploads/qr-images/community_hall/templates/';


    var circles=val.circle;
    fs.mkdir(qr_code_image_path +circles, function(err) {})
    fs.mkdir(template_image_path +circles, function(err) {})
    var unique_no=await module.exports.generate();
    QRCode.toFile(qr_code_image_path+circles+'/'+unique_no+'.png', unique_no, {version: 10},
  function (err)
  {
    loadImage("./community_hall.jpg").then((image) => 
   {
        context.drawImage(image, 0, 0, 1152, 1920);
        const buffer =canvas.toBuffer('image/png');
        fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
        context.drawImage(image, 0, 0);
  });
    const width = 698; 
    const height = 1280;
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
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.owner_name, 435, 807); 
   
       //  //vehicle type
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.house_address, 435, 865);
           //vehicle registeration no
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.type, 435, 915);
       //  //location
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.landmark, 435, 968);
       //  //ward
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.area, 435, 1018);
       //  //circle
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.ward_name, 435, 1068);
       //  //zone
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.circle, 435, 1118); 
     
 
     context.fillStyle = "#000";
     context.font = "28px cambria";
     context.textAlign = "left";
     context.fillText(val.zone, 435, 1168);
 
 
     context.drawImage(image,155, 330, 380, 380); 
     const buffer =canvas.toBuffer('image/png');
     fs.writeFileSync(template_image_path + circles +'/'+ unique_no + ".png",buffer);
     context.drawImage(image, 0, 0);
    });
    });
    const unique_noss = new unique_nos({
        unique_no:unique_no,
        user_id:user_id,
        type_db:'communityhalls',
      })

      unique_noss.save(); 
      console.log("val");
      console.log(val);


     const list = new comunityHall({     
        date: val.date,
        zone: val.zone, 
        circle: val.circle,
        ward_name: val.ward_name, 
        area:val.area,        
        landmark:val.landmark, 
        business_type:val.business_type,   
        type_community:val.type_community,
        business_name:val.business_name,
        shop_address:val.shop_address,
        owner_name:val.owner_name,
        owner_aadhar:val.owner_aadhar,
        owner_mobile:val.owner_mobile,
        licence_number:val.licence_number,
        licence_no:val.licence_number,
        existing_disposal:val.disposal_type,
        quality_waste:val.quantity,
        wastage_quantity:val.wastage_weight,
        zones_id:val.zones_id,
        circles_id:val.circles_id, 
        ward_id:val.ward_id, 
        landmark_id:val.landmark_id,
        area_id:val.area_id,
        tenent_id:val.tenent_id,
        user_id:val.user_id,  
        place:val.place,
        unique_no:unique_no,
        qr_image:template_image_path+circles+"/"+unique_no+'.png',
        qr_code_view:template_image_path+circles+"/"+unique_no+'.png'
});
     
    await list.save();   

   })); 

}


exports.generate = async (req, res) =>  
{
    const string = Str.random(25); 
    const checkstring=await comunityHall.findOne({unique_no:string},{ _id: 1}).countDocuments(); 
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
      cb(null, './uploads/excel'); 
    }, 
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname);
    }
});

exports.upload_user_res = multer({storage: storage});