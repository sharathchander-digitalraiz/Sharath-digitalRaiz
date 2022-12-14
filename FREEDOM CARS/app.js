const express = require("express");
const mongoose = require("mongoose");
const app = express();
var path = require("path");
var multer = require("multer");
var upload = multer();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require("ejs");
require("dotenv").config();

// set template engine 
//app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname,'public')))
//app.use(expressLayout);
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views')); 

// combining and importing all the routes
const v1Route = require("./routes/v1");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add cors to project
app.use(cors());

// defining folder for uploading the files/images/documents
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

mongoose
  .connect(
    `mongodb+srv://sharath:sharath@cluster0.rzhaq3e.mongodb.net/freedom`
  )
  .then(function () {
    console.log(`Connected to database`);
  })
  .catch(function (er) {
    console.log(`Database connection error`, er.message);
  });


// app.get("/", (_req, res) => {
//   res
//     .status(200)
//     .send(
//       ` <h1> <i style="color:#f9184e"> Welcome to freedom cars </i> 🚗🚕🚘🚙🚓 </h1> `
//     );
// });
app.use("/v1", v1Route);
const bookings = require("./model/booking");
// const express = require("express");
// const app = express();

app.get("/all",async(req,res)=>{
    const allData = await bookings.aggregate([
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "CustomerDetails",
          },
        },
        { $unwind: "$CustomerDetails" },
        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "CarNumber",
          },
        },
        { $unwind: "$CarNumber" },
        {
          $lookup: {
              from: "payment",
              localField:"_id",
              foreignField: "bookingId",
              as:"PaymentDetails"
          },
        },
        {$unwind: "$PaymentDetails"},
        {
          $lookup: {
              from: "documents",
              localField:"customerId",
              foreignField:"customerId",
              as:"Documents"
          },
        },
        {$unwind:"Documents"},
        {
          $lookup:{
              from:"securityDeposits",
              to:"bookingId",
              from:"_id",
              as:"Deposit"
          },
        },
        {$unwind:"Deposit"},
        {
          $project: {
              id:"$_id", 
              customerName:1,
              phone:1,
              alternate_phone:1,
              timeSlot:1,
              fromDate:1,
              toDate:1,
              aadharNumber:1,
              dlNumber:1,
              price:1,
              discountPrice: 1,
              totalprice: 1,
              paymethod:1,
              securityDeposite:1,
          }
        }
      ]).exec();
      res.send(allData)
      
})

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`http://127.0.0.1:${process.env.PORT}`);
  }
});
