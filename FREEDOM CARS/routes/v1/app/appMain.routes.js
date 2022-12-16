const express = require("express");
const appRoute = express.Router();
const cors = require("cors");

// importing functions
const custAppRoute = require("./customer.routes");
const carBrandAppRoute = require("./carBrand.routes");
const carModelAppRoute = require("./car.routes");
const notifyAppRoute = require("./notify.routes");
const bookingAppRoute = require("./booking.routes");
const favouritesAppRoute = require("./favourites.routes");
const terms = require("./termsAndConditions")

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

/****************** Notifications apis ****************/
appRoute.use("/notify", notifyAppRoute);

/****************** Car Booking apis ****************/
appRoute.use("/booking", bookingAppRoute);


appRoute.use("/favourites", favouritesAppRoute);

/****************** customer terms ****************/
appRoute.use("/user", terms);

// appRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = appRoute;
