const express = require("express");
const router = express.Router();

// importing the required functions
const { upload_userImages } = require("../../commonMiddleWare");
const { userSignup, userSignin } = require("../../controller/admin/userAuth");
const {
  validate_login,
  isRequestvalidatelogin,
} = require("../../validator/auth");

// defining the routes
router.post("/admin/igiindia/usersignup", upload_userImages.none(), userSignup);

router.post(
  "/admin/igiindia/usersignin",
  validate_login,
  isRequestvalidatelogin,
  userSignin
);

module.exports = router;
