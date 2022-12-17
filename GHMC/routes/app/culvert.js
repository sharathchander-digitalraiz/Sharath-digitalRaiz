var express = require('express');
const { zones_list,circle,wards_list,area,getareawiselandmark } = require('../../controllers/app/setup');
const { add_culvert,update_culvert,editculvert,deleteculvert,getCulvert,getallissues_zone_culvert,getCulvertissue_type,culvertissue,culvertsolved } = require('../../controllers/app/culvert');
const { validatezonelist, isRequestValidatedzonelist,validatecirclelist,
  isRequestValidatedcirclelist,validatewardslist,isRequestValidatedwardslist,
  validatearealist,isRequestValidatedarealist,validateculvert,isRequestValidatedculvert,validateupdateculvert,isRequestupdateValidatedculvert,validatearealandlist,isRequestValidatedarealandlist,validateculvertissue,isRequestupdateculvertissue} = require('../../validators/app/culvert'); 

const upload = require("../../controllers/app/scan").upload;
const culvert_upload = require("../../controllers/app/culvert").upload;
const { requireSignin } = require('../../common-middleware'); 
const { validatescan, isRequestValidatescan,validatehistory,isRequestvalidatehistory,validateabsentvehicles,isRequestabsentvehicles,validateabsentvehiclescoment,isRequestvalidateabsentvehiclescoment,validatevehiclesubmitscan,isRequestvehiclesubmitscan} = require('../../validators/app/scan'); 
const {vehicle_culvert_scan,scan_cronjob,log_history,absent_vehicles,absent_vehicles_coment,vehicle_att}=require("../../controllers/app/scan");
var router = express.Router();
exports.routes = function (app)   
{     
  app.post('/zones_list',requireSignin,upload.none(),validatezonelist,isRequestValidatedzonelist,zones_list);
  app.post('/circle',requireSignin,upload.none(),validatecirclelist,isRequestValidatedcirclelist,circle); 
  app.post('/wards',requireSignin,upload.none(),validatewardslist,isRequestValidatedwardslist,wards_list); 
  app.post('/area',requireSignin,upload.none(),validatearealist,isRequestValidatedarealist,area); 
  app.post('/getareawiselandmark',requireSignin,upload.none(),validatearealandlist,isRequestValidatedarealandlist,getareawiselandmark);
  app.post('/getCulvert',requireSignin,upload.none(),getCulvert);
  app.post('/culvert',requireSignin,upload.none(),validateculvert,isRequestValidatedculvert,add_culvert);
  app.post('/update_culvert',requireSignin,upload.none(),validateupdateculvert,isRequestupdateValidatedculvert,update_culvert);
  app.post('/editculvert',requireSignin,upload.none(),editculvert);
  app.post('/deleteculvert',requireSignin,upload.none(),deleteculvert);

  /****GEt Culvert issues for app */
  app.post('/getallissueszonewise',requireSignin,upload.none(),getallissues_zone_culvert);
  app.post('/culvertissue_type',requireSignin,upload.none(),getCulvertissue_type);
  app.post('/culvertissue',requireSignin,culvert_upload.single('image'),validateculvertissue,isRequestupdateculvertissue,culvertissue);
  app.post('/culvertsolved',requireSignin,culvert_upload.single('image'),culvertsolved);
   /****GEt Culvert issues for app */


  app.post('/scan',requireSignin,upload.none(),validatescan,isRequestValidatescan,vehicle_culvert_scan);  
 app.post('/vehicle_att',requireSignin,upload.single("image"),validatevehiclesubmitscan,isRequestvehiclesubmitscan,vehicle_att); 
  app.post('/scan_cronjob',scan_cronjob);   
  app.post('/log_history',requireSignin,upload.none(),validatehistory,isRequestvalidatehistory,log_history);   
  app.post('/absent_vehicles',requireSignin,upload.none(),validateabsentvehicles,isRequestabsentvehicles,absent_vehicles);   
  app.post('/absent_vehicles_coment',requireSignin,upload.none(),absent_vehicles_coment);   
}     

      