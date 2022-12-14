const express = require("express");
const roleandpermitRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const roleandPermit = require("../../../controller/admin/roleAndPermission.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
roleandpermitRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Branch initial route" });
});

roleandpermitRoute.post(
  "/add-roleandpermission",
  verifyAdminToken,
  upload_userImages.none(),
  roleandPermit.addRoleAndPermission
);
// roleandpermitRoute.post(
//   "/getrolesandpermission",
//   upload_userImages.none(),
//   roleandPermit
// );

// roleandpermitRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = roleandpermitRoute;
