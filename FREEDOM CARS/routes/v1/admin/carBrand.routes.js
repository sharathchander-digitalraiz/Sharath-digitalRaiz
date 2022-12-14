const express = require("express");
const carBrandRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const brand = require("../../../controller/admin/carBrand.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
carBrandRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car brand initial route" });
});

/**************** car brand apis *************/
carBrandRoute.post(
  "/addcarbrand",
  verifyAdminToken,
  upload_userImages.none(),
  brand.addCarBrand
);

carBrandRoute.post(
  "/getcarbrand",
  verifyAdminToken,
  upload_userImages.none(),
  brand.getCarBrand
);

carBrandRoute.post(
  "/getallcarbrands",
  verifyAdminToken,
  upload_userImages.none(),
  brand.getAllCarBrand
);

carBrandRoute.post(
  "/getallactivecarbrands",
  verifyAdminToken,
  upload_userImages.none(),
  brand.getAllActiveCarBrand
);

carBrandRoute.put(
  "/editcarbrand/:id",
  verifyAdminToken,
  upload_userImages.none(),
  brand.editCarBrand
);

carBrandRoute.put(
  "/disablecarbrand/:id",
  verifyAdminToken,
  upload_userImages.none(),
  brand.disableCarBrand
);

carBrandRoute.delete(
  "/removecarbrand/:id",
  verifyAdminToken,
  upload_userImages.none(),
  brand.disableCarBrand
);

// carBrandRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = carBrandRoute;
