const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();
const port = process.env.SJ_PORT;

app.use(cors());
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));

//database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.SJ_DB_USERNAME}:${process.env.SJ_DB_PASSWORD}@cluster0.gfc0ofu.mongodb.net/${process.env.SJ_DB_NAME}`
  )
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Database not Connected!!");
  });
app.get("/", (req, res) => {
  res.status(200).send("I am listening from server");
});

//routes
const adminRoute = require("./routers/admin/admin.router"); //admin router
const employeeRoute = require("./routers/Employees/empRoute"); //employee router
const customerRoute = require("./routers/customers/customer"); //customer router
const paymentRoute = require("./routers/payments/payments"); //payments
const itemsRoute = require("./routers/settings/itemTypes"); //item types
const stoneStorage = require("./routers/settings/stoneStorage"); //stone storage
const beedsRoute = require("./routers/settings/beeds"); //beeds
const orderRoute = require("./routers/order_mangement/orderRoute"); //orders

//final API endpoint
app.use("/santhosh-jewellery", adminRoute); //for admin
app.use("/santhosh-jewellery", employeeRoute); //for employee
app.use("/santhosh-jewellery", customerRoute); //for customer
app.use("/santhosh-jewellery", paymentRoute); //for payments
app.use("/santhosh-jewellery", itemsRoute); //for item type
app.use("/santhosh-jewellery", stoneStorage); //for stone storage
app.use("/santhosh-jewellery", beedsRoute); //for beeds
app.use("/santhosh-jewellery", orderRoute); //for orders

app.listen(port, () => {
  console.log(`server running on http://127.0.0.1:${port}`);
});
