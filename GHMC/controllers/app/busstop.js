const busstop= require("../../model/busstop");
const multer = require('multer'); 
const zone = require("../../model/zones");
const circle = require('../../model/circles');
const wards = require('../../model/wards');
const landmark = require("../../model/landmarks");
const area = require("../../model/area");

exports.createbusstop = async (req, res) => 
{   
  const { zones_id,circles_id,ward_id,landmark_id,area_id,user_id,address,bus_stop_name,latitude,longitude} = req.body;
 
    const zonerow = await zone.findOne({ _id: zones_id}, {_id: 1, name: 1,tenent_id:1 }).exec();
  //  console.log(zonerow); 
    const circlerow = await circle.findOne({ _id: circles_id}, {_id: 1, name: 1,circle_no:1 }).exec();
  //  console.log(circlerow);
    const wardrow = await wards.findOne({ _id: ward_id}, {_id: 1, name: 1,tenent_id:1,wards_no:1}).exec();
  //  console.log(wardrow);
    const landmarkrow = await landmark.findOne({ _id: landmark_id}, {_id: 1, landmark_from: 1, landmark_to: 1}).exec();
  //  console.log(landmarkrow);
    const arearow = await area.findOne({ _id: area_id}, {_id: 1, name: 1}).exec(); 
  //  console.log(arearow);

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
    place.coordinates.push(latitude);
    place.coordinates.push(longitude);
    let productPictures = [];
    // console.log(req.files); 
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => 
      {
        return { img: file.filename };
      });
    }
    const list = new busstop({ 
    user_id:user_id,
    date: dates,
    zone:zonerow.name, 
    circle:circlerow.name,
    ward_name: wardrow.name, 
    area:arearow.name,        
    landmark:landmarkrow.landmark_from+'-'+landmarkrow.landmark_to,   
    address:address,    
    bus_stop_name:bus_stop_name,
    tenent_id:zonerow.tenent_id,
    zones_id:zones_id, 
    circles_id:circles_id, 
    ward_id:ward_id, 
    landmark_id:landmark_id,
    area_id:area_id,
    place:place,
    image:productPictures
});


list.save((error, list) =>  
  {
    if (error) return res.status(404).json({ error });
    if(list) 
    {
      res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  });
};

exports.getallbusstop = async (req,res)=>{     
  const alldata = await busstop.find({status:'Active'}).exec(); 
  return res.status(404).json({status:true,data:alldata});  
}  





exports.editbusstop = async (req,res) =>{   
  const id = req.body.id;  
  await busstop.findOne({_id:id},(err,data)=>{  
      if(err){
          return res.status(404).json({status:false,message:'Data not exists'});    
      }else{ 
          return res.status(200).json({status:true,data});          
      }
  })   
}


exports.updatebusstop = async(req,res)=>{
  const id = req.body.id;
  if(!id){
    return  res.status(404).json({status:false,message:'Bus stop id is required'});  
  }
 
  const zonerow = await zone.findOne({ _id: req.body.zones_id}, {_id: 1, name: 1,tenent_id:1 }).exec();
  const circlerow = await circle.findOne({ _id: req.body.circles_id}, {_id: 1, name: 1,circle_no:1 }).exec();
  const wardrow = await wards.findOne({ _id: req.body.ward_id}, {_id: 1, name: 1,tenent_id:1,wards_no:1}).exec();
  const landmarkrow = await landmark.findOne({ _id: req.body.landmark_id}, {_id: 1, landmark_from: 1, landmark_to: 1}).exec();
  const arearow = await area.findOne({ _id: req.body.area_id}, {_id: 1, name: 1}).exec();
  let productPictures = [];
  //console.log(req.files); 
   if(req.files.length > 0){
      if (req.files.length > 0) {
        productPictures = req.files.map((file) => 
        {
          return { img: file.filename };
        });
      }
  }else{
   var compleximg =  await busstop.findOne({_id:id},{image:1}).exec();
  // console.log(compleximg); 
   productPictures = compleximg.image; 
  }

  const place={};
  place.type='Point';
  place.coordinates=[];
  place.coordinates.push(req.body.latitude); 
  place.coordinates.push(req.body.longitude);
  const updateRecords = {
    ...req.body, 
    image: productPictures, 
    place:place,
    zones_id:req.body.zones_id,
    circles_id:req.body.circles_id,
    ward_id:req.body.ward_id,
    landmark_id:req.body.landmark_id,
    area_id:req.body.area_id,
    zone:zonerow.name,
    circle_no:circlerow.circle_no,
    circle:circlerow.name,  
    wards_no:wardrow.wards_no,  
    ward_name:wardrow.name,
    area:arearow.name,
    landmark:landmarkrow.landmark_from+'-'+landmarkrow.landmark_to,
    user_id:req.user.user_id, 
    modified_by: req.user.user_id, 
    log_date_modified: new Date()  
  }
 
  await busstop.findByIdAndUpdate({_id:id},{...updateRecords},(err,data)=>{  
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


exports.deletebusstop = async (req, res) => { 
  const _id = req.body.id;    
 // console.log(id);
  const updateRecords={ 
    status:'In-active' 
  }
  await busstop.findByIdAndUpdate({_id},{...updateRecords},(err,data)=>{  
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



var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads/bus_stop/')
    },
    filename: (req, file, cb) =>  
    {
      cb(null,  Date.now() + '-' + file.originalname)
    }
  });
  
  exports.uploadbus_stop = multer({storage: storage});  