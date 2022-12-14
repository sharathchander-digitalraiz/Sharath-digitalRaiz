const express = require("express");
const carBrandAppRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const appbrand = require("../../../controller/admin/carBrand.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
carBrandAppRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car brand App initial route" });
});

/**************** car brand apis *************/
carBrandAppRoute.post(
  "/getcarbrand",
  verifyAdminToken,
  upload_userImages.none(),
  appbrand.getCarBrand
);

carBrandAppRoute.post(
  "/getallcarbrands",
  verifyAdminToken,
  upload_userImages.none(),
  appbrand.getAllCarBrand
);

carBrandAppRoute.post(
  "/getallactivecarbrands",
  verifyAdminToken,
  upload_userImages.none(),
  appbrand.getAllActiveCarBrand
);

// carBrandAppRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = carBrandAppRoute;
