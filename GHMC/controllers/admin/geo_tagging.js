const gvpbep = require('../../model/gvpbep'); 
const culvert=require("../../model/culvert");
const zones=require('../../model/zones');
const wards=require("../../model/wards");
const user =require("../../model/users");
const circles =require("../../model/circles");
const useraccess=require("../../model/useraccess");
const garbagetrips=require("../../model/garbagetrips");
const complex_building=require("../../model/complex_building");
const community_halls=require("../../model/communityhall");
const residentialHouses=require("../../model/residential_house");
const operations=require("../../model/operations");
const temples=require("../../model/temple");
const streetVendors=require("../../model/streetvendor");
const manholeTreeBustops=require("../../model/man_hole_tree_busstop");
const toilets=require("../../model/toilets");
const toilets_operations=require("../../model/toilets_operations");
const Parking=require("../../model/parking");
const openPlaces=require("../../model/openplace");
const {ObjectId} = require('mongodb'); // or ObjectID
var multer = require('multer');
var gvpbepimage_url="http://103.160.144.135:2000/uploads/";

                                                                   
exports.geoTagging = async(req, res) =>  
{ 
  const { user_id,zoneId,circleId,wardId,areaId,landmarkId,geotagType} = req.body;
    var finalResults={};
    if(geotagType=="gvpbep")
    {
       finalResults=await module.exports.gepbep(zoneId,circleId,wardId,areaId,landmarkId);
        console.log(finalResults);
    }
    else if(geotagType=="complex_building")
    {
      finalResults=await module.exports.complex_building(zoneId,circleId,wardId,areaId,landmarkId,'comercial_buildings');
    }
    else if(geotagType=="community_halls")
    {
      finalResults=await module.exports.communityhalls(zoneId,circleId,wardId,areaId,landmarkId,'communityhalls');
    }
    else if(geotagType=="residential_houses")
    {
      finalResults=await module.exports.residential_houses(zoneId,circleId,wardId,areaId,landmarkId,'residential_houses');
    }
    else if(geotagType=="temples_church_masjid")
    {
      finalResults=await module.exports.temples(zoneId,circleId,wardId,areaId,landmarkId,'temples');
    }
    else if(geotagType=="streetvendors")
    {
      finalResults=await module.exports.streetvendors(zoneId,circleId,wardId,areaId,landmarkId,'streetvendors');
    }
    else if(geotagType=="man_hole_tree_busstops")
    {
      finalResults=await module.exports.streetvendors(zoneId,circleId,wardId,areaId,landmarkId,'man_hole_tree_busstops');
    }
    else if(geotagType=="toilets")
    {
      finalResults=await module.exports.toilets(zoneId,circleId,wardId,areaId,landmarkId,'toilets');
    }
    else if(geotagType=="openplace")
    {
      finalResults=await module.exports.open_places(zoneId,circleId,wardId,areaId,landmarkId,'open_places');
    }
    else if(geotagType=="parking")
    {
      finalResults=await module.exports.parking(zoneId,circleId,wardId,areaId,landmarkId,'parkings');
    }
    console.log(geotagType);
  responseObject = {success: true,login: true,data:finalResults};
  res.status(200).json(responseObject);
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => 
    {
      cb(null, './uploads/complaint/')
    },
    filename: (req, file, cb) => 
    {
      cb(null,  Date.now() + '-' + file.originalname)
    }
});

exports.upload = multer({storage: storage});


exports.gepbep= async function(zoneId,circleId,wardId,areaId,landmarkId)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zone_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circle_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";

  console.log(condition);
  console.log("condition");
  //condition['date']=date;
  let gvpbep_data=await gvpbep.find(condition).exec();
  let finalResult =[]; 
  console.log(gvpbep_data);
  await Promise.all(gvpbep_data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    if(value.type=='GVP' || value.type=='Gvp')
    {
      result.type= 'GVP'; 
    }
    if(value.type=='BEP' || value.type=='Bep')
    {
      result.type= 'BEP'; 
    }
    //result.type=value.type; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await garbagetrips.find({import_gvp_bep_id:value._id,date:date}).countDocuments();
    let trips_data=await garbagetrips.findOne({import_gvp_bep_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        if(value.type=='GVP' || value.type=='gvp' || value.type=='Gvp')
        {
            result.color = 'Red'; 
        }
        else if(value.type=='BEP' || value.type=='bep')
        {
            result.color = 'Orange'; 
        }
        result.image="";
        console.log(value.type);
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+trips_data.image;
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+trips_data.image;
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+trips_data.image;
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}


exports.culvert= async function(condition) 
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);

  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 
  console.log(condition);
  //condition['date']=date;
  let culvert_data=await culvert.find(condition).exec();
  let finalResult =[]; 
  console.log(culvert_data);
  await Promise.all(culvert_data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    if(value.type=='GVP' || value.type=='Gvp')
    {
      result.type= 'GVP'; 
    }
    if(value.type=='BEP' || value.type=='Bep')
    {
      result.type= 'BEP'; 
    }
    //result.type=value.type; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await garbagetrips.find({import_gvp_bep_id:value._id,date:date}).countDocuments();
    let trips_data=await garbagetrips.findOne({import_gvp_bep_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        if(value.type=='GVP' || value.type=='gvp' || value.type=='Gvp')
        {
            result.color = 'Red'; 
        }
        else if(value.type=='BEP' || value.type=='bep')
        {
            result.color = 'Orange'; 
        }
        result.image="";
        console.log(value.type);
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+trips_data.image;
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+trips_data.image;
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+trips_data.image;
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}



exports.complex_building= async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
   // condition['db_type']="comercial_buildings";
    
  console.log(condition);
  console.log("condition");
  //condition['date']=date;
  let complex_building_data=await complex_building.find(condition).exec();
  let finalResult =[]; 
  console.log(complex_building_data);
  await Promise.all(complex_building_data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    // if(value.type=='GVP' || value.type=='Gvp')
    // {
    //   result.type= 'GVP'; 
    // }
    // if(value.type=='BEP' || value.type=='Bep')
    // {
    //   result.type= 'BEP'; 
    // }
    result.type="complex_building"; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({import_gvp_bep_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'commercial_building/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'commercial_building/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'commercial_building/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}


exports.communityhalls= async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
   // condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await community_halls.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type="communityhalls"; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'commercial_building/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'commercial_building/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'commercial_building/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}

exports.residential_houses= async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
    //condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await residentialHouses.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type="communityhalls"; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'commercial_building/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'commercial_building/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'commercial_building/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}
exports.temples= async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
    //condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await temples.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type="temples"; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'temples/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}



exports.streetvendors= async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
    //condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await streetVendors.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type="streetvendors"; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'temples/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}
exports.man_hole_tree_busstops = async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
   // condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await manholeTreeBustops.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type="manholeTreeBustops"; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'temples/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}
exports.toilets = async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
    //condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await toilets.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type=Mtype; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await toilets_operations.find({collection_id:value._id,date:date}).countDocuments();
    let trips_data=await toilets_operations.findOne({collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'temples/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}

exports.open_places = async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
  //  condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await openPlaces.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type=Mtype; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'temples/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}
exports.parking = async function(zoneId,circleId,wardId,areaId,landmarkId,Mtype)
{
  let date_ob = new Date();
  let dates = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();

  let seconds = date_ob.getSeconds();

  let date = year + "-" + month + "-" + dates; 

  const  condition={
    // zones_id:"",
    // circle_id:"",
    // ward_d:"",
    // area_id:"",
    // landmark_id:''
  };

/* 
   let user_data=await user.findOne({_id:user_id},{user_access_id:1,department_id:1}).exec();
   let user_access_data=await useraccess.findOne({_id:user_data.user_access_id}).exec();
*/
    if(zoneId!="all" && zoneId!='')
    {
        condition['zones_id']=ObjectId(zoneId);
    }
    if(circleId!="" && circleId!="all")
    {
        condition['circles_id']=ObjectId(circleId);
    }
    if(wardId!="" && wardId!="all")
    {
        condition['ward_d']=ObjectId(wardId)
    }
    if(areaId!="" && areaId!="all")
    {
        condition['area_id']=ObjectId(areaId);
    }
    if(landmarkId!="" && landmarkId!="all")
    {
        condition['landmark_id']=ObjectId(landmarkId);
    }
    condition['status']="Active";
    //condition['db_type']=Mtype;
    
  console.log(condition);
  //condition['date']=date;
  let data=await Parking.find(condition).exec();
  let finalResult =[]; 
  await Promise.all(data.map(async (value)=>
  {
    var result ={}; 
    console.log(value);
    result.id=value._id; 
    result.type=Mtype; 
    result.area=value.area;
    result.landmark=value.landmark;
    result.latitude=''+value.place.coordinates[0];
    result.longitude=""+value.place.coordinates[1];
    //console.log(new date(date));
    let trips=await operations.find({db_type:Mtype,collection_id:value._id,date:date}).countDocuments();
    let trips_data=await operations.findOne({db_type:Mtype,collection_id:value._id,date:new Date()}).sort({_id:-1}).exec();
    if(trips==0)
    {
        result.color = 'Red'; 
        result.image="";
    }
    else if(trips == '1')
    {
        result.color = 'Yellow';
        result.image=gvpbepimage_url+'temples/'+ trips_data.image[0]['img'];
    }
    else if(trips == '2')
    {
        result.color = 'Blue';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    else if(trips >= '3')
    {
        result.color = 'Green';
        result.image=gvpbepimage_url+'temples/'+trips_data.image[0]['img'];
    }
    result.trips=trips;
    finalResult.push(result);
  }));
  return finalResult;
}







