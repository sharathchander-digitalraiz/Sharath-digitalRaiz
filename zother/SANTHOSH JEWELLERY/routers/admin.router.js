const express = require("express");
const router = express.Router();

//middlewares
const verifyToken = require("../middlewares/verifyToken");
const imgeUpload = require("../middlewares/multer");

//controllers
const adminEmpControl = require("../controllers/adminAuth");

//API requests deleteAdminEmp
router.post(
  "/useradd",
  imgeUpload.uploadImage.single("avatar"),
  adminEmpControl.addUser
);
router.post("/userlogin", adminEmpControl.userLogin);
router.put(
  "/userChangepassword",
  verifyToken.verifyToken,
  adminEmpControl.updateUser
);
router.get("/userProfile", verifyToken.verifyToken, adminEmpControl.userLogin);
router.put(
  "/userProfilEdit",
  verifyToken.verifyToken,
  imgeUpload.uploadImage.single("avatar"),
  adminEmpControl.updateUser
);
router.delete("/deleteUserProfile/:id", adminEmpControl.deleteUser);

module.exports = router;
