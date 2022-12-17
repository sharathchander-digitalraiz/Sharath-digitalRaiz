var express = require('express');
const app = express();
const multer = require('multer');
const { login,token_validate,user_access,access } = require('../../controllers/app/auth');
const { getvehicletype } = require('../../controllers/app/vechiles_type');  
const { owner_type,dash_vechiles_type } = require('../../controllers/app/owner_type'); 
const { distance_gvp} = require('../../controllers/app/distance_gvpbep'); 
const { transfer,add_transfer_station}   = require('../../controllers/app/transfer'); 
const upload = require("../../controllers/app/transfer").upload;
const { requireSignin } = require('../../common-middleware'); 
const path = require('path'); 
const { isRequestvalidatelogin,validate_login}=require("../../validators/app/auth");
const { validate_import_tran_sta, isReq_val_import_tansfer_sta} = require('../../validators/app/import_transfer_station_val'); 

/* All Modules App dashboard */
const { all_appmodules_dashboard,all_appmodules_dashboard_search,allmoduleslist,download_excel,download_excle_dashboard } = require('../../controllers/app/all_appmodules_dashboard'); 

 
var router = express.Router();
exports.routes = function (app)  
{   
  app.post('/user_access',upload.none(),requireSignin,user_access);
  app.post('/access',upload.none(),requireSignin,access);
  app.post('/token_validate',upload.none(),requireSignin,token_validate);
  app.post('/token_validate',upload.none(),requireSignin,token_validate);
  app.post('/login',upload.none(),validate_login,isRequestvalidatelogin,login);
  app.get('/dash_vechiles_type',dash_vechiles_type); 
  app.get('/vechiles_type',upload.none(),getvehicletype); 
  app.get('/owner_type',upload.none(),owner_type);   
  app.get('/transfer',upload.none(),transfer);  
  app.post('/distance_gvp',upload.none(),distance_gvp); 
  app.post('/add_transfer_station',upload.single('image'),requireSignin,validate_import_tran_sta,isReq_val_import_tansfer_sta,add_transfer_station)
 
  /* All Modules App dashboard */
  app.post('/all_appmodules_dashboard',requireSignin,upload.none(),all_appmodules_dashboard); 
  app.post('/admin/api/all_appmodules_dashboard_search',requireSignin,upload.none(),all_appmodules_dashboard_search); 
  app.get('/allmoduleslist',upload.none(),allmoduleslist); 
  app.get('/download_excel/:upload/:excel/:type/:year/:name',upload.none(),download_excel)
  app.get('/download_excle_dashboard/:name/:user_id/:tenent_id',upload.none(),download_excle_dashboard)
  
}       