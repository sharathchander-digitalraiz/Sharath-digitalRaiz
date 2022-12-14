const express = require("express");
const specRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const spec = require("../../../controller/admin/carSpec.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
specRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car Specs initial route" });
});

/**************** Car specs apis *************/
specRoute.post(
  "/addcarspecification",
  verifyAdminToken,
  upload_userImages.single("countryImg"),
  spec.addCarSpecs
);

specRoute.post(
  "/getallcarspecifications",
  verifyAdminToken,
  upload_userImages.none(),
  spec.getAllCarSpecs
);

specRoute.post(
  "/getallactivecarspecifications",
  verifyAdminToken,
  upload_userImages.none(),
  spec.getAllActiveSpecs
);

specRoute.put(
  "/editcarspec/:id",
  verifyAdminToken,
  upload_userImages.none(),
  spec.editCarSpecs
);

specRoute.put(
  "/disablecarspec/:id",
  verifyAdminToken,
  upload_userImages.none(),
  spec.disableCarSpec
);

// specRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = specRoute;
