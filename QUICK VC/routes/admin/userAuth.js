const express = require("express");
const router = express.Router();

// importing functions
const { upload_userImages, verifyToken } = require("../../commonMiddleWare");
const {
  getUserProfile,
  editUserProfile,
  getAllUserProfiles,
  remvoveUser
} = require("../../controller/web/profile/profile");
const { adminSignup, adminSignin } = require("../../controller/admin/userAuth");
const {
  validate_login,
  isRequestvalidatelogin
} = require("../../validator/auth");
const {
  validate_signup,
  isRequestvalidateSignup
} = require("../../validator/signup");
const { userPasswordChange } = require("../../controller/web/userAuth");

// defining routes
router.post(
  "/admin/instavc/signup",
  upload_userImages.none(),
  validate_signup,
  isRequestvalidateSignup,
  adminSignup
);
router.post(
  "/admin/instavc/signin",
  upload_userImages.none(),
  validate_login,
  isRequestvalidatelogin,
  adminSignin
);

/************** User Profile Routes *******************/

router.post("/admin/profile/get-profile", verifyToken, getUserProfile);
router.put(
  "/admin/profile/edit-profile/:id",
  verifyToken,
  upload_userImages.none(),
  editUserProfile
);

router.post("/admin/profile/getall-users", verifyToken, getAllUserProfiles);

router.post("/admin/profile/change-pass", verifyToken, userPasswordChange);

router.delete("/admin/profile/removeuser/:id", verifyToken, remvoveUser);

module.exports = router;
