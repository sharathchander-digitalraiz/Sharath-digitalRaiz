var express = require('express');
const app = express();
const multer = require('multer');
const { services_type,add_support } = require('../../controllers/app/complaint');
const upload = require("../../controllers/app/complaint").upload;
const { requireSignin } = require('../../common-middleware'); 

/* Complaint */
const { editcomplaint,updatecomplaint,deletecomplaint,getallcomplaint } = require('../../controllers/app/complaint');
const {validatesupport,isRequestvalidatesupport}=require("../../validators/app/complaint");

var router = express.Router();

exports.routes = function (app)  
{    
  app.get('/services_type',upload.none(),requireSignin,services_type);
     /* Complaint box */
     app.post('/add_support',upload.single("image"),requireSignin,validatesupport,isRequestvalidatesupport,add_support);
     app.post('/editcomplaint',upload.none(),requireSignin,editcomplaint);   
     app.post('/updatecomplaint',upload.single("image"),requireSignin,updatecomplaint);  
     app.post('/deletecomplaint',upload.none(),requireSignin,deletecomplaint);
     app.get('/getallcomplaint',upload.none(),requireSignin,getallcomplaint); 
}       