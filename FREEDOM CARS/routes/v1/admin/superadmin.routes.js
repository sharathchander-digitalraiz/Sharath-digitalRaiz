const superAuthRoute = require("express").Router();
const ProfileRoute = require("express").Router();

//  Importing the auth controller
const superadminauth = require("../../../controller/admin/superadmin.controller");
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const { upload_userImages } = require("../../../middleware/mediaupload");

//defining routes

/************ super admin auth apis **************/
superAuthRoute.post(
  "/superadminregister",
  upload_userImages.none(),
  superadminauth.superAdminSignup
);

superAuthRoute.post("/superadminlogin", superadminauth.superAdminSignin);

module.exports = superAuthRoute;
