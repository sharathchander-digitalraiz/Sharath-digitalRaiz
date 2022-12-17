var express = require('express');
const app = express();
const multer = require('multer');
const { mapgvpbvp,gvp_bep_list,add_gvp_bep,add_new_gvp_bep } = require('../../controllers/app/gvp_bep');
const upload = require("../../controllers/app/complaint").upload;
const { requireSignin } = require('../../common-middleware'); 
const {validategvpbep,isRequestvalidategvpbep,validateaddgvpbep,isRequestvalidateaddgvpbep,validateadd_newgvpbep,isRequestadd_newvalidateaddgvpbep}=require("../../validators/app/gvpbep");
var router = express.Router();
exports.routes = function (app)  
{   
  app.post('/mapgvpbvp',upload.none(),requireSignin,validategvpbep,isRequestvalidategvpbep,mapgvpbvp);
  app.post('/gvp_bep_list',upload.none(),requireSignin,gvp_bep_list);
  app.post('/add_gvp_bep',upload.none(),requireSignin,validateaddgvpbep,isRequestvalidateaddgvpbep,add_gvp_bep);
  app.post('/add_new_gvp_bep',upload.none(),requireSignin,validateadd_newgvpbep,isRequestadd_newvalidateaddgvpbep,add_new_gvp_bep);
}       