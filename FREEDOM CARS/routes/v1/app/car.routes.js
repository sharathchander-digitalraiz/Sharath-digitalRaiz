const express = require("express");
const carModelAppRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const appCarModel = require("../../../controller/admin/car.controller");
const appHome = require("../../../controller/app/carDashboard.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
carModelAppRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car Model App initial route" });
});

/**************** car brand apis *************/
carModelAppRoute.post(
  "/getcarmodel",
  verifyAdminToken,
  upload_userImages.none(),
  appCarModel.getCar
);

carModelAppRoute.post(
  "/getallcarmodels",
  verifyAdminToken,
  upload_userImages.none(),
  appCarModel.getAllCars
);

carModelAppRoute.post(
  "/getallactivecarmodels",
  verifyAdminToken,
  upload_userImages.none(),
  appCarModel.getAllActiveCars
);

// carModelAppRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

/***************** Get app dashboard - home screen items **********/
carModelAppRoute.post(
  "/getapphomeitems",
  verifyAdminToken,
  upload_userImages.none(),
  appHome.getAppHomeItems
);



carModelAppRoute.post(
  "/gettypecars",
  verifyAdminToken,
  upload_userImages.none(),
  appHome.gettypecars
);

// search cars
carModelAppRoute.post(
  "/searchcarsfromsearchbar",
  verifyAdminToken,
  upload_userImages.none(),
  appHome.carSearch
);

// Filter cars
carModelAppRoute.post(
  "/filtercarsinfiltersection",
  verifyAdminToken,
  upload_userImages.none(),
  appHome.getFilteredCars
);

module.exports = carModelAppRoute;
