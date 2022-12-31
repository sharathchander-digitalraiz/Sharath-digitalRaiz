const express = require("express");
const router = express.Router();

// importing the required functions
const { verifyToken } = require("../../../commonMiddleWare");
const {
  getUserProfile,
} = require("../../../controller/admin/profile/getAdminProfile");
const {
  updateProfile,
} = require("../../../controller/admin/profile/updateProfile");
const {
  userPasswordChange,
  generateOtp,
  compareOtp,
  resetPasswordController,
} = require("../../../controller/admin/userAuth");

// defining the routes
router.post("/admin/igiindia/get-profile", verifyToken, getUserProfile);

router.put("/admin/igiindia/get-profile/:id", verifyToken, updateProfile);

router.post("/admin/igiindia/changepassword", verifyToken, userPasswordChange);

/************** Forgot Password APIs ***************/
router.post("/admin/igiindia/generateotp", generateOtp);

router.post("/admin/igiindia/compareotp", compareOtp);

router.post("/admin/igiindia/resetpassword", resetPasswordController);

module.exports = router;
