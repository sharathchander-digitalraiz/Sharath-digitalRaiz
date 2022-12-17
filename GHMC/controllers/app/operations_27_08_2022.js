const operations= require("../../model/operations");
const multer = require('multer'); 
const zone = require("../../model/zones");
const circle = require('../../model/circles');
const wards = require('../../model/wards');
const landmark = require("../../model/landmarks");
const area = require("../../model/area");
const complex_building = require("../../model/complex_building");
const complex_build_two= require("../../model/complex_build2");
const communityhall = require('../../model/communityhall'); 
const streetvendors = require('../../model/streetvendor'); 
const parking = require('../../model/parking'); 
const residential_house = require('../../model/residential_house'); 
const open_place = require('../../model/openplace');
const man_hole_tree_busstops = require('../../model/man_hole_tree_busstop'); 
const temples = require('../../model/temple'); 

exports.createoperations = async (req, res) => 
{   
    const { user_id,
    collection_id,wt_type,db_type,picked_denied,approx_weight,reason} = req.body;  
    var result;
    if(db_type == 'comercial_buildings'){
      result = await complex_building.findOne({ _id: collection_id });
    } 
    if(db_type == 'comercial_flats'){
       var cf = await complex_build_two.findOne({ _id: collection_id });
       result =  await complex_building.findOne({_id:cf.complex_id}); 
    } 
    if(db_type == 'communityhalls'){ 
      result = await communityhall.findOne({ _id: collection_id }); 
    }
    if(db_type == 'streetvendors'){
      result = await streetvendors.findOne({ _id: collection_id });
    }
    if(db_type == 'parkings'){
      result = await parking.findOne({ _id: collection_id });
    }
    if(db_type == 'residential_houses'){
      result = await residential_house.findOne({ _id: collection_id  });
    }
    if(db_type == 'open_places'){
      result = await open_place.findOne({  _id: collection_id });
    }
    if(db_type == 'man_hole_tree_busstops'){
      result =  await man_hole_tree_busstops.findOne({_id: collection_id }); 
    }
    if(db_type == 'temples'){
      result =  await temples.findOne({_id: collection_id }); 
    }
    const zonerow = await zone.findOne({ _id: result.zones_id}, {_id: 1, name: 1,tenent_id:1 }).exec();
    
    const circlerow = await circle.findOne({ _id: result.circles_id}, {_id: 1, name: 1,circle_no:1 }).exec();

    const wardrow = await wards.findOne({ _id: result.ward_id}, {_id: 1, name: 1,tenent_id:1,wards_no:1}).exec();

    const landmarkrow = await landmark.findOne({ _id: result.landmark_id}, {_id: 1, landmark_from: 1, landmark_to: 1}).exec();

    const arearow = await area.findOne({ _id: result.area_id}, {_id: 1, name: 1}).exec();


    let current_datetime = new Date();
    let s = new String(current_datetime.getDate());
    let cd; 	
	if(s.length == 1){ 
	      cd = '0'+s;
    }else{
	       cd = current_datetime.getDate(); 
	}
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;
 
     var productPictures = [];  
   // console.log(req.files);   
    if (req.files.length > 0) {
     productPictures = req.files.map((file) => 
     {
       return { img: file.filename };
     }); 
    } 
    
    if(picked_denied == 1){
        if(!wt_type || wt_type == ''){
          return res.status(400).json({ "success":false,"login":true,"message":'Weight type field is required'});
        }
        if(!approx_weight){
            return res.status(400).json({ "success":false,"login":true,"message":'Approx weight field is required'});
        }
        if(req.files.length == 0){
            return res.status(400).json({ "success":false,"login":true,"message":'Image field is required'});
        }
    }
    
    if(picked_denied == 0){ 
        if(!reason){
            return res.status(400).json({ "success":false,"login":true,"message":'Reason field is required'});
        }
    }      

      

    const list = new operations({  
    date: formatted_date,
    zone:zonerow.name, 
    circle:circlerow.name,
    ward_name: wardrow.name, 
    area:arearow.name,        
    landmark:landmarkrow.landmark_from+'-'+landmarkrow.landmark_to,   
    collection_id:collection_id,
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
    image:productPictures
   
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

exports.upload_operations = multer({storage: storage}); 

