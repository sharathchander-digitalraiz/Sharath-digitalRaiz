const express = require("express");
const branchRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const branchControl = require("../../../controller/admin/branch.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
branchRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Branch initial route" });
});

branchRoute.post(
  "/branchmanagerregister",
  verifyAdminToken,
  upload_userImages.none(),
  branchControl.branchMngrSignup
);
branchRoute.post(
  "/branchmanagersignin",
  upload_userImages.none(),
  branchControl.branchMngrSignin
);

// branchRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = branchRoute;
