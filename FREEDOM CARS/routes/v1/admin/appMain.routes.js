const express = require("express");
const appRoute = express.Router();
const cors = require("cors");

// importing functions
const custAppRoute = require("./customer.routes");
const carBrandAppRoute = require("./carBrand.routes");
const carModelAppRoute = require("./car.routes");

// defining routes
appRoute.get("/", function (req, res) {
  res.status(200).json({ message: "App initial route" });
});

/****************** customer apis ****************/
appRoute.use("/customer", custAppRoute);

/****************** car brands apis ****************/
appRoute.use("/brand", carBrandAppRoute);

/****************** car brands apis ****************/
appRoute.use("/carmodel", carModelAppRoute); 
 


// appRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

appRoute

module.exports = appRoute;
