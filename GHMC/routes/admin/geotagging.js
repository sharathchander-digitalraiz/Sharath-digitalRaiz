const express = require('express');
const { requireSignin } = require('../../common-middleware');
var cors = require('cors');
const {geoTagging,upload}  = require('../../controllers/admin/geo_tagging');

var router = express.Router();   
exports.routes = function (app)   
{  
  app.post('/admin/api/geoTagging', upload.none(),requireSignin,geoTagging);       
  
} 