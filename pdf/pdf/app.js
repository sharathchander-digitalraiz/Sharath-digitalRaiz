var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./pdf.router'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.listen(8000,()=>{
  console.log(`http://127.0.0.1:8000`)
})

// const express = require("express");
// const express = require("express-handlebars");
// const app = express();
// const mongoose = require("mongoose");

// app.engine("handlebars", engine());
// app.set("view engine", "handlebars");
// app.set("views", "./views");
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.render("home");
// });

// mongoose
//   .connect(`mongodb+srv://sharath:sharath@cluster0.rzhaq3e.mongodb.net/test`)
//   .then(function () {
//     console.log(`Connected to database`);
//   })
//   .catch(function (er) {
//     console.log(`Database connection error`, er.message);
//   });

// app.post("/add", async (req, res) => {
//   try {
//     const customerAdded = new cust({
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       logDateCreated: new Date().toUTCString(),
//     }).save((err, data) => {
//       if (data) {
//         res
//           .status(200)
//           .json({
//             success: true,
//             message: "successfully added data",
//             customerAdded,
//           });
//       } else {
//         res.status(400).json({ success: false, message: "Bad Request", err });
//       }
//     });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ success: false, message: "something went wrong", err });
//   }
// });
// app.get("/all", async function (req, res) {
//   try {
//     const emplResult = await cust.find({});
//     if (emplResult) res.status(200).json({ message: "Success", emplResult });
//     else res.status(400).json({ message: "Bad Request" });
//   } catch (err) {
//     res.status(400).json({ message: "Bad request", err });
//   }
// });

// app.get("/", async (req, res) => {
//   const passengers = await cust.find({});
//   const filePath = path.join(__dirname, "print.ejs");
//   ejs.renderFile(filePath, { passengers }, (err, html) => {
//     if (err) {
//       res.send("");
//     }
//     res.send(html);
//   });
// });

// app.listen(3000, () => console.log("http://127.0.0.1:3000"));

// app.listen(3000, () => console.log('The server is running on port 3000'))
// // app.listen(process.env.PORT, (err) => {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log(`http://127.0.0.1:1000`);
// //   }
// // });
