var express = require('express');
const { createLadmarks } = require('../controllers/landmarks');
var router = express.Router();
// router.get('/', function(req, res, next) 
// {
//   res.send('respond with a resource');
// });
// //router.post('/createLadmarks',createLadmarks);
// module.exports = router;


exports.routes = function (app) 
{
  app.post('/createLadmarks',  createLadmarks); 
}