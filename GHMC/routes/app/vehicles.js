var express = require('express');
const { addVehicles,addadminVehicles,upload } = require('../../controllers/app/vehicles');
const { validatevehicles,isRequestValidatedvehicles} = require('../../validators/app/vehicles'); 


/* Dashboard zone chart api */
const {dashboard_api}= require('../../controllers/app/dashboard_api'); 

/* Excel Vehicle */
const {totalExcel} = require('../../controllers/app/excelVehicle'); 

/* Excel Vehicle Swatch */
const {totalswatchExcel} = require('../../controllers/app/TotalswatchExcel'); 

/* Excel Vehicle Non Swatch */
const {totalnonswatchExcel} = require('../../controllers/app/TotalnotswatchExcel');  


const { requireSignin } = require('../../common-middleware'); 
var router = express.Router();
exports.routes = function (app)   
{     
  app.post('/add_vechile',requireSignin,upload.single("image"),validatevehicles,isRequestValidatedvehicles,addVehicles);
  app.post('/addadminVehicles',requireSignin,upload.none(),validatevehicles,isRequestValidatedvehicles,addadminVehicles);

   /* Dashboard zone api */
   app.post('/vechile_dashboard',upload.none(),requireSignin,dashboard_api); 

   /* Excel Vehicle */
   app.get('/api/totalExcel',upload.none(),totalExcel); 

   /* Excel Vehicle Swatch */ 
   app.get('/api/totalswatchExcel',upload.none(),totalswatchExcel); 

   /* Excel Vehicle Non Swatch */
   app.get('/api/totalnonswatchExcel',upload.none(),totalnonswatchExcel);  
}     

      