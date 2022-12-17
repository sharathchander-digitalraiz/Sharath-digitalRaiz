const culvert = require("../../model/culvert");
const culvert_issues=require("../../model/culvertissue");
const complex_building = require("../../model/complex_building");
const communityhall = require('../../model/communityhall'); 
const complex_build_two= require("../../model/complex_build2");
const streetvendors = require('../../model/streetvendor'); 
const parking = require('../../model/parking'); 
const residential_house = require('../../model/residential_house'); 
const open_place = require('../../model/openplace');
const man_hole_tree_busstops = require('../../model/man_hole_tree_busstop'); 
const temples = require('../../model/temple'); 
const toilets = require('../../model/toilets'); 
const unique_nos = require('../../model/unique_nos'); 
const user = require("../../model/users");
const useraccess = require("../../model/useraccess");
const vehicle = require("../../model/vehicles");
const vehicle_attandance=require("../../model/vehicles_attandance");
const absent_vehicles_reason=require("../../model/absentreason");
var multer = require('multer');
exports.vehicle_culvert_scan = async(req, res) => {
  
  const { user_id, geo_id } = req.body; 
  if(geo_id == undefined && geo_id == ''){ 
      return res.status(400).json({ success: true, login: true, message: 'Id is required'})
  }
  const vehicle_rows = await vehicle.findOne({ unique_no: geo_id }).countDocuments();
  const unique_no_row = await unique_nos.findOne({ unique_no:geo_id }).countDocuments(); 
  if (vehicle_rows != "0")
  {
      var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      if(curr_month>10)
      {
        curr_month=curr_month;
      }
      else
      {
       curr_month='0'+curr_month;
      }
       var curr_year = d.getFullYear();
      const response = {};
      var  vehicle_lists = await vehicle.findOne({ unique_no: geo_id });
      console.log(vehicle_lists);
      response.col_id = vehicle_lists._id;
      response.owner_type = vehicle_lists.owner_type;
      response.vechile_type = vehicle_lists.vehicle_type;
      response.vechile_no = vehicle_lists.vehicle_registration_number;
      response.driver_name = vehicle_lists.driver_name;
      response.driver_no = vehicle_lists.driver_number;
      response.address = " ";
      response.landmark = vehicle_lists.location;
      response.ward_name = vehicle_lists.ward_name;
      response.circle = vehicle_lists.circle;
      response.zone = vehicle_lists.zone;
      response.created_date = d;
      response.date_time = d;
      response.geo_id = vehicle_lists.unique_no;
      response.scan_type = 'vehicle';
      response.db_type = 'vehicle';
      response.type = 'vehicle';
      response.depth = "";
      response.culvert_id = "";
      response.culvert_type = "";
      response.culvert_name = "";
      response.area = "";
      response.distance = "";
   
      return res.status(200).json({ success: true, login: true, message: 'Successfully scanned', 
     data:response});
  }else if(unique_no_row != 0){
       
        var result = await unique_nos.findOne({ unique_no:geo_id });
        if(result.type_db == 'comercial_buildings'){
            let qr_response = {};
            var result_commercial = await complex_building.findOne({ unique_no: geo_id });
            qr_response.db_type = 'comercial_buildings';
            qr_response.name =  result_commercial.name; 
            qr_response.address =  result_commercial.address;
            qr_response.floors =  result_commercial.floors;       
            qr_response.zone =  result_commercial.zone;         
            qr_response.circle =  result_commercial.circle;    
            qr_response.ward_name =  result_commercial.ward_name;   
            qr_response.area =  result_commercial.area;  
            qr_response.landmark =  result_commercial.landmark;  
            qr_response.col_id = result_commercial._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});  
        }else if(result.type_db == 'comercial_flats'){ 
          let qr_response = {};
          var result_buildtwo = await complex_build_two.findOne({ unique_no: geo_id });
          var result_buildone = await complex_building.findOne({_id:result_buildtwo.complex_id}); 
          qr_response.db_type = 'comercial_flats';
          qr_response.business_name =  result_buildtwo.business_name; 
          qr_response.category =  result_buildtwo.category; 
          qr_response.name =  result_buildone.name;
          qr_response.zone =  result_buildone.zone;
          qr_response.circle =  result_buildone.circle;
          qr_response.ward_name =  result_buildone.ward_name; 
          qr_response.area =  result_buildone.area;    
          qr_response.landmark =  result_buildone.landmark;
          qr_response.col_id =  result_buildtwo._id; 
          return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
          data:qr_response});
      }else if(result.type_db == 'communityhalls'){ 
            let qr_response = {};
            var result_community = await communityhall.findOne({ unique_no: geo_id });
            qr_response.db_type = 'communityhalls';
            qr_response.business_type =  result_community.business_type; 
            qr_response.business_name =  result_community.business_name; 
            qr_response.shop_address =  result_community.shop_address;
            qr_response.zone =  result_community.zone;
            qr_response.circle =  result_community.circle;
            qr_response.ward_name =  result_community.ward_name;
            qr_response.area =  result_community.area;  
            qr_response.landmark =  result_community.landmark;
            qr_response.col_id =  result_community._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'streetvendors')
        {
            let qr_response = {};
            var result_streetvendors = await streetvendors.findOne({ unique_no: geo_id });
            qr_response.db_type = 'streetvendors';
          
            qr_response.owner_name =  result_streetvendors.owner_name;  
            qr_response.business_type = result_streetvendors.business_type; 
            qr_response.business_name = result_streetvendors.business_name; 
            qr_response.zone =  result_streetvendors.zone;
            qr_response.circle =  result_streetvendors.circle;
            qr_response.ward_name =  result_streetvendors.ward_name; 
            qr_response.area =  result_streetvendors.area;  
            qr_response.landmark =  result_streetvendors.landmark;
            qr_response.col_id =  result_streetvendors._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'parkings'){
            let qr_response = {};
            var result_parking = await parking.findOne({ unique_no: geo_id });
            qr_response.db_type = 'parkings';
            qr_response.parking_name = result_parking.parking_name; 
            qr_response.owner_name =  result_parking.owner_name; 
            qr_response.address =  result_parking.address; 
            qr_response.zone =  result_parking.zone;
            qr_response.circle =  result_parking.circle;
            qr_response.ward_name =  result_parking.ward_name;
            qr_response.landmark =  result_parking.landmark;
            qr_response.area =  result_parking.area;
            qr_response.col_id =  result_parking._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'residential_houses')
        {
            let qr_response = {};
            var result_residential_house = await residential_house.findOne({ unique_no: geo_id });
            qr_response.db_type = 'residential_houses';
    
            qr_response.house_type =  result_residential_house.type;
            qr_response.house_address =  result_residential_house.house_address; 
            qr_response.owner_name =  result_residential_house.owner_name; 
            qr_response.zone =  result_residential_house.zone;
            qr_response.circle =  result_residential_house.circle; 
            qr_response.ward_name =  result_residential_house.ward_name;
            qr_response.area =  result_residential_house.area;  
            qr_response.landmark =  result_residential_house.landmark;
            qr_response.col_id =  result_residential_house._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'open_places'){
            let qr_response = {};
            var result_open_place = await open_place.findOne({ unique_no: geo_id });
            qr_response.db_type = 'open_places';
            qr_response.address =  result_open_place.address;
            qr_response.open_place_name =  result_open_place.open_place_name;
            qr_response.incharge_name =  result_open_place.incharge_name; 
            qr_response.zone =  result_open_place.zone;
            qr_response.circle =  result_open_place.circle;
            qr_response.ward_name =  result_open_place.ward_name; 
            qr_response.area =  result_open_place.area;  
            qr_response.landmark =  result_open_place.landmark;
            qr_response.col_id =  result_open_place._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'man_hole_tree_busstops')
        {
            let qr_response = {};
            var result_man_hole = await man_hole_tree_busstops.findOne({ unique_no: geo_id });
            qr_response.db_type = 'man_hole_tree_busstops';
            qr_response.man_hole_name = result_man_hole.man_hole_name; 
            qr_response.type = result_man_hole.type; 
            qr_response.address =  result_man_hole.address;
            qr_response.zone =  result_man_hole.zone;
            qr_response.circle =  result_man_hole.circle;
            qr_response.ward_name =  result_man_hole.ward_name; 
            qr_response.area =  result_man_hole.area;  
            qr_response.landmark =  result_man_hole.landmark;
            qr_response.col_id =  result_man_hole._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'temples')
        {
            let qr_response = {};
            var result_temples = await temples.findOne({ unique_no: geo_id });
            qr_response.db_type = 'temples';
            qr_response.address =  result_temples.address;
            qr_response.temple_name = result_temples.temple_name; 
            qr_response.incharge_name =  result_temples.incharge_name;
            qr_response.zone =  result_temples.zone;
            qr_response.circle =  result_temples.circle; 
            qr_response.ward_name =  result_temples.ward_name; 
            qr_response.area =  result_temples.area;  
            qr_response.landmark =  result_temples.landmark;  
            qr_response.col_id =  result_temples._id; 
            return res.status(200).json({ success: true, login: true, message: 'Successfully scanned',
            data:qr_response});
        }else if(result.type_db == 'toilets')
        {
           let qr_response = {};
            
          var result_toilets = await toilets.findOne({ unique_no: geo_id });
           qr_response.db_type = 'toilets';
           qr_response.address =  result_toilets.address;
           qr_response.temple_name = result_toilets.toilet_name; 
           qr_response.incharge_name =  result_toilets.incharge_name;
           qr_response.zone =  result_toilets.zone;
           qr_response.circle =  result_toilets.circle; 
           qr_response.ward_name =  result_toilets.ward_name; 
           qr_response.area =  result_toilets.area;    
           qr_response.landmark =  result_toilets.landmark;    
           qr_response.col_id =  result_toilets._id; 
           return res.status(200).json({ success: true, login: true, message: 'Successfully completed', data: qr_response });

        }
  }
  else {
    const users_list = await user.findOne({ _id: user_id }).exec();
    console.log("users_list.department_name");
    console.log(users_list.department_name);
    if (users_list.department_name == 'Transfer Station Manager' || users_list.department_name=='Admin' ||  users_list.department_name=='AE' || 
	users_list.department_name=='Zonal Commissioner' || users_list.department_name=='Circle Commissioner') 
    {  
      const culvert_list_rows = await culvert.findOne({ unique_no: geo_id }).countDocuments();
      console.log(culvert);
      if (culvert_list_rows!= "0") 
      {
        const culvert_list = await culvert.findOne({ unique_no: geo_id }).exec();
        const culvert_issues_list = await culvert_issues.findOne({ _id: culvert_list._id }).exec();
        const response = {};
        response.col_id = culvert_list._id;
        response.owner_type = "";
       
        response.ward_name = culvert_list.ward;
        response.geo_id = culvert_list.unique_no;
        response.db_type = 'culvert';
        response.type = 'culvert';
        response.vechile_type = "";
        response.vechile_no = "";
        response.driver_name = "";
        response.driver_no = "";
        response.address = "";
        response.created_date = '';
        response.date_time = "";
        response.geo_id = "";
        response.depth = culvert_list.depth;
        //response.depth = "10";
        response.culvert_id = culvert_list._id;
        response.culvert_type = culvert_list.type;
        response.culvert_name = culvert_list.name;
        response.area = culvert_list.area;
        response.distance = "1";
        response.landmark = culvert_list.landmark;
        response.ward = culvert_list.ward;
        response.circle = culvert_list.circle;
        response.zone = culvert_list.zone;
        response.scan_type = 'culvert';
        return res.status(200).json({ success: true, login: true, message: 'Successfully completed', data: response });

      }
      else {
        return res.status(200).json({ success: true, login: true, message: 'No results found', data: [] });
      }
    }
    else {
      return res.status(400).json({ success: false, login: true, message: 'Not accessed', data: [] });

    }

  }
};

exports.culvert_issues = async (req, res) => {
  const { user_id } = req.body;

}
exports.scan_cronjob = async (req, res) => 
{
  const vehicle_rows = await vehicle.find({status:"Active"}).exec();
  const docs = [];
  let current_datetime = new Date();
  console.log(vehicle_rows);
// let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate();
let s = new String(current_datetime.getDate());
    let cd; 	
	if(s.length == 1)
  {
	      cd = '0'+s;
  }
  else
  {
        cd = current_datetime.getDate(); 
  }
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;
  vehicle_rows.forEach(function(item)
   {
    console.log(formatted_date);
    console.log("formatted_date");
    docs.push({                
    date:formatted_date,
    time:'',
    zone: item.zone,
    circle_no:item.circle_no,
    circle: item.circle,  
    wards_no: item.wards_no,   
    ward_name: item.ward_name,
    vehicle_registration_number:item.vehicle_registration_number,
    owner_type_id:item.owner_type_id,
    owner_type: item.owner_type, 
    vehicle_unique_no:item.unique_no,
    vehicle_id:item._id,
    tenent_id:item.tenent_id,
    zones_id:item.zones_id,
    circles_id:item.circles_id,
    ward_id:item.ward_id,
    landmark_id:item.landmark_id,
    location:item.location,
    vehicle_type_id:item.vehicle_type_id,
    vehicle_type:item.vehicle_type,
    sfa_name:item.incharge,
    sfa_mobile_number:item.incharge_mobile_number,
    comment_update:"no",
    scanned_address:null,
    latitude:null,
    longitude:null,
    scan_image:null
 });

    });
    const options = { ordered: true };
    console.log(docs);
    const result=await  vehicle_attandance.insertMany(docs, options);
    responseObject = { success: true, login: true, message:result.insertedCount+' Saved successfully' }
    res.status(200).json(responseObject);
}



exports.log_history = async (req, res) => 
{
  const { user_id} = req.body;
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
  const vehicle_rows = await vehicle_attandance.find({date:curr_date + "-" + curr_month + "-" + curr_year,attandance:1,user_id:user_id}).exec();
  const docs = [];
  vehicle_rows.forEach(function(item)
   {
    docs.push({                
    date:item.date+" "+item.time,
    vechile_type:item.vehicle_type,
    vechile_registration_number:item.vehicle_registration_number,
    sfa_name:item.sfa_name,
    landmark:item.location,
    ward_name: item.ward_name,
    circle: item.circle, 
    zone:item.zone         
   });

    });
    responseObject = { success: true, login: true, message:'Successfully Completed',data:docs}
    res.status(200).json(responseObject);
}

exports.absent_vehicles = async (req, res) => 
{
  const { user_id,date,vehicle_type} = req.body;
  if(vehicle_type=="all")
  {
    //const vehicle_rows = await vehicle_attandance.find({date:date,attandance:0}).exec();
  }
  else
  {
    //$or: [ { status: "A" }, { qty: { $lt: 30 } } ]
    
  }

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
  const vehicle_rows = await vehicle_attandance.find({date:dates,attandance:0}).exec();
  const docs = [];
  vehicle_rows.forEach(function(item)
   {
    docs.push({                
    id:item.vehicle_id,
    // vehicle_id:item.vehicle_id,
    vechile_type:item.vehicle_type,
    vechile_registration_number:item.vehicle_registration_number,
    sfa_name:item.sfa_name,
    sfa_mobile_number:item.sfa_mobile_number,
    landmark:item.landmark,
    ward_name: item.ward_name,
    circle: item.circle, 
    zone:item.zone,
    comment_update:item.comment_update       
 });

    });
    responseObject = { success: true, login: true, message:'Successfully Completed',data:docs}
    res.status(200).json(responseObject);
}


exports.absent_vehicles_coment = async (req, res) => 
{
  const { user_id,date,id,comment} = req.body;
 var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  
  var curr_year = d.getFullYear();
  if(curr_month>=10)
  {
    curr_month=curr_month;
  }
  else
  {
    curr_month='0'+curr_month;
  }
  var dates=curr_year+'-'+curr_month+'-'+curr_date;
  const save_vehicles = new absent_vehicles_reason({
    vehicle_id:id,
    user_id:user_id,
    comment: comment,
    reason: " ",
    date: dates,
    created_by: user_id,

  });
    await vehicle_attandance.findOneAndUpdate({vehicle_id:id,date:dates,attandance:0},{comment_update:'yes'},(err,data)=>{
          console.log(err);
          console.log("err");
         console.log(data);
});

  var att=await vehicle_attandance.find({date:dates,attandance:0}).exec();
  save_vehicles.save((error, user) => 
  {
    if (error) return res.status(400).json({ error });
    if (user) {
      responseObject = { success: true, login: true, message: 'Saved successfully' }
      res.status(200).json(responseObject);
    }
  });
}

exports.add_new_gvp_bep = async (req, res) => 
{
  const { user_id,type,longitude,lattitude,landmark,ward,circle,zone} = req.body;
  const save_vehicles = new absent_vehicles_reason({
    vehicle_id:id,
    user_id:user_id,
    comment: comment,
    reason: " ",
    date: dates,
    created_by: user_id,

  });
    await vehicle_attandance.findOneAndUpdate({vehicle_id:id,date:dates,attandance:0},{comment_update:'yes'},(err,data)=>{
          console.log(err);
          console.log("err");
         console.log(data);
});

  var att=await vehicle_attandance.find({date:dates,attandance:0}).exec();
  save_vehicles.save((error, user) => 
  {
    if (error) return res.status(400).json({ error });
    if (user) {
      responseObject = { success: true, login: true, message: 'Saved successfully' }
      res.status(200).json(responseObject);
    }
  });
}


exports.vehicle_att = async (req, res) => 
{
  const { user_id,geo_id,address,latitude,longitude} = req.body;
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  if(curr_month>10)
  {
    curr_month=curr_month;
  }
  else
  {
   curr_month='0'+curr_month;
  }
 
var start = d.toLocaleTimeString().split(" ");
  var curr_year = d.getFullYear();
  var dates=curr_year+'-'+curr_month+'-'+curr_date;
  var att_rows=await vehicle_attandance.findOne({date:dates,attandance:0,vehicle_unique_no:geo_id}).countDocuments();
  if(att_rows!=0)
  {
    const image=req.file.filename;
    await vehicle_attandance.findOneAndUpdate({vehicle_unique_no:geo_id,date:dates,attandance:0},
      {attandance:1,user_id:user_id,scanned_address:address,latitude:latitude,longitude,scan_image:image,log_date_modified:Date.now(),time:start[0]},
      (err,data)=>
    {
      responseObject = { success: true, login: true, message: 'Scanned successfully'}
      res.status(200).json(responseObject);
    });
  }
  else
  {
    responseObject = { success: true, login: true, message: 'Already  Scan Completed' }
    res.status(200).json(responseObject);
  }
}



var storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/vehicle_attandance/')
  },
  filename: (req, file, cb) => 
  {
    cb(null,  Date.now() + '-' + file.originalname)
  }
});

exports.upload = multer({storage: storage});

