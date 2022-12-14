const express = require("express");
const versionRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const varsion = require("../../../controller/admin/version.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
versionRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Version initial route" });
});

/**************** car version apis *************/
versionRoute.post(
  "/addcarversion",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.addCarVersion
);
versionRoute.post(
  "/getallversions",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.getAllVersions
);
versionRoute.post(
  "/getallactiveversions",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.getAllActiveVersions
);
versionRoute.put(
  "/editversdion/:id",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.editCarVarsion
);
versionRoute.put(
  "/disableversion/:id",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.disableCarVarsion
);
versionRoute.put(
  "/enableversion/:id",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.enableCarVarsion
);
versionRoute.post(
  "/getcarversionbymodelid",
  verifyAdminToken,
  upload_userImages.none(),
  varsion.getCarVersionByModel
);

// versionRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = versionRoute;
