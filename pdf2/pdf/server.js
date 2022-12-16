// const express = require("express");
// const app = express();
// var path = require("path");
// const ejs = require("ejs");

// // set template engine
// app.set("view engine", "ejs");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));




//data server
const express = require('express')
const ejs = require('ejs')
const path = require('path')
const app = express()
const mongoose = require("mongoose");
const cust = require("./customer")
app.use(express.json());

// const passengers = [
//     {
//         name: "Joyce",
//         flightNumber: 7859,
//         time: "18h00",
//     },
//     {
//         name: "Brock",
//         flightNumber: 7859,
//         time: "18h00",
//     },
//     {
//         name: "Eve",
//         flightNumber: 7859,
//         time: "18h00",
//     },
// ];
mongoose
  .connect(
    `mongodb+srv://sharath:sharath@cluster0.rzhaq3e.mongodb.net/test`
  )
  .then(function () {
    console.log(`Connected to database`);
  })
  .catch(function (er) {
    console.log(`Database connection error`, er.message);
  });


  app.post('/add',async (req, res) => {
   // try {
      const customerAdded = new cust({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        logDateCreated: new Date().toUTCString(),
      }).save((err, data) => {
        if (data) {
          res
            .status(200)
            .json({ success: true, message: "successfully added data" ,customerAdded});
        } else {
          res.status(400).json({ success: false, message: "Bad Request", err });
        }
      });
    // } catch (err) {
    //   res.status(400).json({ success: false, message: "something went wrong",err });
    // }
  });
  app.get('/all',async function (req, res) {
    try {
      const emplResult = await cust.find({});
      if(emplResult)
      res.status(200).json({ message: "Success", emplResult });
      else 
      res.status(400).json({ message: "Bad Request" });
    } catch (err) {
      res.status(400).json({ message: "Bad request", err});
    }
  });

app.get('/', async(req, res) => {
    const passengers = await cust.find({});
    const filePath = path.join(__dirname, "print.ejs")
    ejs.renderFile(filePath, { passengers }, (err, html) => {
        if(err) {
           res.send('')
        }
        res.send(html)
    })
   
})

app.listen(3000, () => console.log('The server is running on port 3000'))
// app.listen(process.env.PORT, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`http://127.0.0.1:1000`);
//   }
// });
