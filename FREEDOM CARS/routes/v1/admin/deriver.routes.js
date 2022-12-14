const express = require("express");
const driverRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const drivr = require("../../../controller/admin/driver.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
driverRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Driver initial route" });
});

/**************** driver self signup *************/
driverRoute.post(
  "/driverselfregister",
  upload_userImages.none(),
  drivr.driverSignup
);

/**************** driver registration by admin ***********/
driverRoute.post(
  "/driveradminregister",
  verifyAdminToken,
  upload_userImages.none(),
  drivr.driverSignup
);

/**************** driver signin ***************/
driverRoute.post(
  "/driversignin",
  upload_userImages.none(),
  drivr.driverSignin
);

/**************** driver get details by id *******/
driverRoute.post("/getdetailsbyid", verifyAdminToken, drivr.getDriverDetails);

driverRoute.post("/getalldrivers", verifyAdminToken, drivr.getAllDrivers);

driverRoute.post(
  "/getallactivedrivers",
  verifyAdminToken,
  drivr.getAllActiveDrivers
);

/**************** update driver verification **************/
driverRoute.put(
  "/editdriververification/:id",
  verifyAdminToken,
  drivr.verifyDriverDetails
);

// driverRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = driverRoute;
