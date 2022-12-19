var express = require('express');
var cors = require('cors');
const { createUser } = require('../controllers/users');
const { createtenent,uploadTenent } = require('../controllers/tenent');
const { add_zones } = require('../controllers/zones');
const { createcircles } = require('../controllers/circles');
const { createwards } = require('../controllers/wards');
const { createculvert } = require('../controllers/culvert'); 
const { createculvertissue } = require('../controllers/culvertissue'); 
const { createculvertsolved } = require('../controllers/culvertsolved'); 
const { createissuetype } = require('../controllers/issuetype'); 
const { createusersunique } = require('../controllers/usersunique');   
const { createownertype } = require('../controllers/ownertype'); 
const { createimportdata } = require('../controllers/importdata'); 
const { createtransferstation } = require('../controllers/transferstation');  
const { createLadmarks } = require('../controllers/landmarks'); 
const { creategvpbep } = require('../controllers/gvpbep'); 
const { creategarbagetrips } = require('../controllers/garbagetrips'); 
const { createservicetype } = require('../controllers/servicetype'); 
const { geotagaccess,mobileappaccess }  = require('../controllers/useraccess');  
const { createuseraccess,updateuseraccess } = require('../controllers/useraccess'); 
const { createabsentreason } = require('../controllers/absentreason'); 
const { createaccesslogdetails } = require('../controllers/access_log_details'); 
const {validatelandmarks, isRequestValidatelandmark} = require('../validators/landmark');  
const {validatecircles,isRequestValidatedcircle} = require('../validators/circles');  
const {validatewards,isRequestValidatedward} = require('../validators/wards');  
const upload = require('../controllers/app/transfer').upload; 
const { createdepartment } = require('../controllers/department'); 
const { getdepartments,editdepartments,updatedepartment,deletedepartment }  = require('../controllers/getdepartments'); 

const { creategeoscreen } = require('../controllers/geoscreen'); 
const { validatetenents, isRequestValidatedtenent} = require('../validators/tenents');  
const {validatezones, isRequestValidated}   = require('../validators/zones'); 
const { validatedepartment, isRequestValidateddepartment} = require('../validators/department'); 
const { requireSignin } = require('../common-middleware'); 

var router = express.Router();
exports.routes = function (app)  
{  
  app.post('/createusers',  createUser);  
  app.post('/admin/api/createtenent',uploadTenent.single('image'),cors(),requireSignin,validatetenents,isRequestValidatedtenent,createtenent);  
  app.post('/admin/api/add_zones',upload.none(),cors(),requireSignin,validatezones,isRequestValidated, add_zones);    
  app.post('/createcircles',upload.none(),cors(),validatecircles,isRequestValidatedcircle,createcircles);    
  app.post('/createwards',upload.none(),cors(),validatewards,isRequestValidatedward, createwards);   
  app.post('/createlandmarks',upload.none(),cors(),requireSignin,validatelandmarks,isRequestValidatelandmark, createLadmarks) ; 
  app.post('/createculvert',upload.none(), createculvert);    
  app.post('/createculvertissue',upload.none(),createculvertissue);    
  app.post('/createculvertsolved',upload.none(),createculvertsolved);    
  app.post('/createissuetype',upload.none(),createissuetype);   
  app.post('/createusersunique',upload.none(),createusersunique);   
  app.post('/createownertype',upload.none(),createownertype);  
  app.post('/createimportdata',upload.none(),createimportdata);    
  app.post('/createtransferstation',upload.none(),createtransferstation);   
  app.post('/creategvpbep',upload.none(),creategvpbep);     
  app.post('/creategarbagetrips',upload.none(),creategarbagetrips);   
  app.post('/createservicetype',upload.none(),createservicetype);   

  app.post('/createuseraccess',upload.none(),cors(),requireSignin, createuseraccess);    
  app.post('/updateuseraccess',upload.none(),cors(),requireSignin, updateuseraccess);    
  app.post('/geotagaccess',cors(),upload.none(),requireSignin,geotagaccess);   
  app.post('/mobileappaccess',cors(),requireSignin,mobileappaccess);    
  app.post('/createabsentreason',createabsentreason);  
  app.post('/createaccesslogdetails',createaccesslogdetails);
  app.post('/add_department',upload.none(),requireSignin,validatedepartment,isRequestValidateddepartment,createdepartment);
  app.post('/departments',upload.none(),cors(),getdepartments);  
  app.post('/editdepartments',upload.none(),requireSignin,editdepartments);   
  app.post('/updatedepartment',upload.none(),requireSignin,updatedepartment);   
  app.post('/delete_department',upload.none(),requireSignin,deletedepartment); 
  app.post('/creategeoscreen',creategeoscreen);
} 