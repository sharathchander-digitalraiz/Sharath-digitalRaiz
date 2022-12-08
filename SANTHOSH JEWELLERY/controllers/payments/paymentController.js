const razorpay = require("razorpay");
const crypto = require("crypto");
const ejs = require("ejs"); 
const express = require("express");
const app = express();
const { param } = require("../../routers/admin/admin.router");
const dotenv = require("dotenv");
dotenv.config();

app.set("view engine", "ejs");
const instance = new razorpay({
  key_id: process.env.ROZ_KEY_ID,
  key_secret: process.env.ROZ_SECRET,
});

//routes get
exports.payments = (req, res) => {
  res.render("payments", { key: process.env.ROZ_KEY_ID });
};

//orders
exports.orders = (req, res) => {
   params = req.body;
  instance.orders
    .create(params)
    .then((data) => {
      res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
      res.send({ sub: error, status: "failed" });
    });
};

//verify
exports.verify = (req, res) => {
  body = req.body.razorpay_order_id +"|"+ req.body.razorpay_payment_id;
  let expectedSignature = crypto
    .createHmac("sha256", process.env.process.env.ROZ_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("sign" + req.body.razorpay_signature);
  console.log("sig" + expectedSignature);
  var response = { status: "failure" };
  if(expectedSignature === req.body.razorpay_signature)
   response = { status: "success" };
  res.send(response);
};
