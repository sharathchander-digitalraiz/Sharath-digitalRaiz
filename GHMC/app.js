var createError = require('http-errors');
const env = require("dotenv");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var  bodyParser = require('body-parser');
require('dotenv').config({path:__dirname+'.env'})
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const  config = require('config');
var indexRouter = require('./routes/index');
var landmarksRouter = require('./routes/landmarks');
var setupRouter = require('./routes/setup');
var usersRouter = require('./routes/users');
const authRouters = require('./routes/auth'); 
var cors = require('cors');
const cron = require('node-cron');
var request = require('request');
const appauthRouters = require('./routes/app/auth');
const admindashboardRoutes = require('./routes/admin/dashboard_routes'); 
const complaint = require('./routes/app/complaint');
const gvpbep = require('./routes/app/gvpbvp');
const culvert =require('./routes/app/culvert');
const vehicles =require('./routes/app/vehicles');
const complex_building =require('./routes/app/complex_building');
// ADMIN ROUTES
const adminsetupRoutes = require('./routes/admin/setupadmin'); 
const customized_reports = require('./routes/admin/customized_reports/customized_reports'); 
const geotagging=require("./routes/admin/geotagging");
var app = express(); 
var multer = require('multer');  
var upload = multer();  
const router = express.Router();
app.use('/api', router);
//mongoose.connect('mongodb+srv://ghmc_user:azH6UhIrYVBE12Qm@ghmc.lzc2g.mongodb.net/GEO_GHMC?retryWrites=true&w=majority',
//mongoose.connect('mongodb://127.0.0.1:27017/GHMC_SANITATION',
mongoose.connect('mongodb://iotroncs_user:GUCHwDu1v@103.171.181.73:27017/iotroncs_ghmcsanatition?retryWrites=true&w=majority',
{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
} 
).then(() =>
   {
    console.log("Database connected");
    console.log("new folder");
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(upload.array()); 

//app.use(express.static(path.join(__dirname, '/public')));
//app.use("/public", express.static(path.join(__dirname, 'public')));
app.use('/uploads',cors(),express.static(__dirname + '/uploads'));
app.use('/images',cors(),express.static(__dirname + '/images'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
landmarksRouter.routes(app);
setupRouter.routes(app); 

app.use(cors());

appauthRouters.routes(app);
complaint.routes(app);
complex_building.routes(app);
culvert.routes(app);
gvpbep.routes(app);
vehicles.routes(app);
// ADMIN ROUTES
adminsetupRoutes.routes(app); 
customized_reports.routes(app); 
admindashboardRoutes.routes(app); 
authRouters.routes(app); 
geotagging.routes(app);
// catch 404 and forward to error handler
app.use(function(req, res, next)
{
res.header("Access-Control-Allow-Origin", '*');
res.header("Access-Control-Allow-Credentials", true);
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
// next(createError(404));
next();

});




// error handler
/*app.use(function(err, req, res, next)  
{
    res.header("Access-Control-Allow-Origin", '*');
res.header("Access-Control-Allow-Credentials", true);
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/


// Backup a run  at 11:59 PM every day.
cron.schedule('0 0 * * *', function()
{
    console.log('running a task every minute');
var options = {
  'method': 'POST',
  'url': 'http://103.171.181.73:2000/scan_cronjob'
};
request(options, function (error, response) 
{
  //console.log(response.body);
});
});

cron.schedule('0 0 * * *', function()
{
    var options = {
      'method': 'GET',
      'url': 'http://103.171.181.73:2000/Culvertscan_cronjob'
    };
    request(options, function (error, response) 
    {
      console.log("responsebody");
    });
});
cron.schedule('0 0 * * *', function()
{
    var options = {
      'method': 'POST',
      'url': 'http://103.171.181.73:2000/templescan_cronjob'
    };
    request(options, function (error, response) 
    {
      console.log("responsebody");
    });
});

// streat vendor cron job
cron.schedule("0 0 * * * *", function () {
  var options = {
    method: "POST",
    url: "http://103.171.181.73:2000/streatvendor_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of streat vendor operations");
  });
});

cron.schedule("0 0 * * * *", function () {
  var options = {
    method: "POST",
    url: "http://103.171.181.73:2000/toiletsscan_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of streat vendor operations");
  });
});
// manhole tree bus stop cron job
cron.schedule("0 0 * * *", function () {
  var options = {
    method: "POST",
    url: "http://103.171.181.73:2000/manholetreebusstop_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of manhole, tree, bus stop operations");
  });
});

// open place cron job
cron.schedule("0 0 * * *", function () {
  let options = {
    method: "POST",
    url: "http://103.171.181.73:2000/openplace_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of manhole, tree, bus stop operations");
  });
});

// parking cron job
cron.schedule("0 0 * * *", function () {
  let options = {
    method: "POST",
    url: "http://103.171.181.73:2000/parking_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of manhole, tree, bus stop operations");
  });
});

// complex building cron job
cron.schedule("0 0 * * *", function () {
  let options = {
    method: "POST",
    url: "http://103.171.181.73:2000/complexbuilding_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of manhole, tree, bus stop operations");
  });
});

// community hall cron job
cron.schedule("0 0 * * *", function () {
  let options = {
    method: "POST",
    url: "http://103.171.181.73:2000/communityhall_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of community hall operations");
  });
});
// residential houses cron job
cron.schedule("0 0 * * *", function () {
  let options = {
    method: "POST",
    url: "http://103.171.181.73:2000/residentialhouses_cronjob"
  };
  request(options, function (error, response) {
    console.log("responsebody of residential house operations");
  });
});

app.listen(2000, () => {
  console.log('Server is running on port 2000');
});

module.exports = app;
