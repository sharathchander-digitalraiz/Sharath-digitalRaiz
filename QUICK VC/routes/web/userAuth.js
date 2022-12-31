const express = require("express");
const router = express.Router();

// importing functions
const { upload_userImages, verifyToken } = require("../../commonMiddleWare");
const {
  getUserProfile,
  editUserProfile,
  getAllUserProfiles
} = require("../../controller/web/profile/profile");
const {
  userSignup,
  userSignin,
  generateOtp,
  compareOtp,
  resetPasswordController,
  userPasswordChange
} = require("../../controller/web/userAuth");
const {
  validate_login,
  isRequestvalidatelogin
} = require("../../validator/auth");
const {
  validate_signup,
  isRequestvalidateSignup
} = require("../../validator/signup");

// defining routes
router.post(
  "/web/instavc/signup",
  upload_userImages.none(),
  validate_signup,
  isRequestvalidateSignup,
  userSignup
);
router.post(
  "/web/instavc/signin",
  upload_userImages.none(),
  validate_login,
  isRequestvalidatelogin,
  userSignin
);

/************** User Profile Routes *******************/

router.post("/web/profile/get-profile", verifyToken, getUserProfile);
router.put(
  "/web/profile/edit-profile/:id",
  verifyToken,
  upload_userImages.none(),
  editUserProfile
);

router.post("/web/profile/getall-users", getAllUserProfiles);

router.post("/web/profile/change-pass", verifyToken, userPasswordChange);

// ************ Forgot password ******************

router.post("/admin/instavc/generateotp", generateOtp);

router.post("/admin/instavc/compareotp", compareOtp);

router.post("/admin/instavc/resetpass", resetPasswordController);

module.exports = router;
