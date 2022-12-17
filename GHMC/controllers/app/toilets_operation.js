const operations= require("../../model/operations");
const multer = require('multer'); 
const zone = require("../../model/zones");
const circle = require('../../model/circles');
const wards = require('../../model/wards');
const landmark = require("../../model/landmarks");
const area = require("../../model/area");
const toilets_operations = require('../../model/toilets_operations'); 
const toilets = require('../../model/toilets'); 


exports.create_toiletsoperations = async (req, res) => 
{   
    const { user_id,
    collection_id,wt_type,db_type,picked_denied,approx_weight,reason,operation_type,reason_type,reason_type_description} = req.body;  
  
    var result = await toilets.findOne({ _id: collection_id });
    const zonerow = await zone.findOne({ _id: result.zones_id}, {_id: 1, name: 1,tenent_id:1 }).exec();
    
    const circlerow = await circle.findOne({ _id: result.circles_id}, {_id: 1, name: 1,circle_no:1 }).exec();

    const wardrow = await wards.findOne({ _id: result.ward_id}, {_id: 1, name: 1,tenent_id:1,wards_no:1}).exec();

    const landmarkrow = await landmark.findOne({ _id: result.landmark_id}, {_id: 1, landmark_from: 1, landmark_to: 1}).exec();

    const arearow = await area.findOne({ _id: result.area_id}, {_id: 1, name: 1}).exec();
 

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
 
     var productPictures = [];  
   // console.log(req.files);   
    if (req.files.length > 0) {
     productPictures = req.files.map((file) => 
     {
       return { img: file.path };
     }); 
    } 
    
    if(operation_type == 'Picking Garbage'){
        if(!picked_denied || picked_denied==''){
            return res.status(400).json({ "success":false,"login":true,"message":'Please select picked or denied'});
        } 
    if(picked_denied == 1){
        if(!approx_weight || approx_weight== ''){
            return res.status(400).json({ "success":false,"login":true,"message":'Approx weight field is required'});
        }
        if(req.files.length == 0){
            return res.status(400).json({ "success":false,"login":true,"message":'Image field is required'});
        }
    } 
    
    if(picked_denied == 0){ 
        if(!reason || reason == ''){
            return res.status(400).json({ "success":false,"login":true,"message":'Reason  is required'});
        }
    }      
}else if(operation_type == 'Cleaning'){
    if(req.files.length == 0){
        return res.status(400).json({ "success":false,"login":true,"message":'Image field is required'});
    }
    if(!reason_type || reason_type==''){
        return res.status(400).json({ "success":false,"login":true,"message":'Please select reason type'});
    }
    if(reason_type == 'Damages'){
         if(!reason_type_description || reason_type_description==''){
            return res.status(400).json({ "success":false,"login":true,"message":'Please enter reason description'});
         }
    }
}


let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd; 	
  let mn; 	
  if(s.length == 1)
  {
	      cd = '0'+s;
  }
  else
  {
        cd = current_datetime.getDate(); 
  }
	if(M.length == 1)
  {
         mn = '0'+M;
  }
  else
  {
      mn = current_datetime.getMonth() + 1 
  }
  let formatted_date =   current_datetime.getFullYear() + "-" +mn+ "-" +cd;

  const structure={
    wt_type:wt_type,
    db_type:db_type,
    picked_denied:picked_denied,
    approx_weight:approx_weight, 
    reason:reason,
    user_id:user_id,
    image:productPictures,
    operation_type: operation_type,
    reason_type:reason_type,
    reason_type_description:reason_type_description 
  }

const data = await toilets_operations.updateOne({date:formatted_date,collection_id:collection_id},structure,
(err,data)=>
{
  if(err)
  {
    res.status(400).json({success: false, login: true, message: 'Not saved.Please try again'});
  }
  res.status(200).json({success: true, login: true, message: 'Saved successfully'});
});

/*    const list = new toilets_operations({  
    
    wt_type:wt_type,
    db_type:db_type,
    picked_denied:picked_denied,
    approx_weight:approx_weight, 
    reason:reason,
    tenent_id:zonerow.tenent_id,  
    zones_id:result.zones_id, 
    circles_id:result.circles_id,  
    ward_id:result.ward_id, 
    landmark_id:result.landmark_id,
    area_id:result.area_id,
    user_id:user_id,
    image:productPictures,
    operation_type: operation_type,
    reason_type:reason_type,
    reason_type_description:reason_type_description 
});

list.save((error, list) =>  
  {
    if (error) return res.status(400).json({ error });
    if(list) 
    {
   
      res.status(200).json({success: true, login: true, message: 'Saved successfully' });
    }
  });

  */




};




var storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/operations/') 
  },
  filename: (req, file, cb) =>  
  {
    cb(null,  Date.now() + '-' + file.originalname)
  }
});

exports.upload_toilets_operations = multer({storage: storage}); 

