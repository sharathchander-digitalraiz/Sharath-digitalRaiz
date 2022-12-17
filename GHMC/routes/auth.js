var express = require('express');
const { login } = require('../controllers/admin/auth');
const { isRequestvalidatelogin,validate_login}=require('../validators/auth');
const upload = require("../controllers/app/transfer").upload;
var router = express.Router();
exports.routes = function (app)  
{  
  app.post('/admin/api/login',upload.none(),validate_login,isRequestvalidatelogin,login);  
}   