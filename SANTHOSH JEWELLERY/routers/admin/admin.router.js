const express = require("express");
const router = express.Router();

//middlewares
const verifyToken = require("../../middlewares/verifyToken");
const imgeUpload = require("../../middlewares/multer");

//controllers
const adminController = require("../../controllers/admin/adminAuth");
const adminPasswordChange = require("../../controllers/admin/adminChangePassword");

//API requests deleteAdminEmp
router.post(
  "/admin-add",
  imgeUpload.uploadImage.single("avatar"),
  adminController.addAdmin
);
router.post("/admin-login", adminController.adminLogin);
router.put(
  "/admin-changepassword",
  verifyToken.verifyToken,
  adminPasswordChange.changePassword
);
router.get("/admin-profile", verifyToken.verifyToken, adminController.getAdmin);
router.put(
  "/admin-profile-edit",
  verifyToken.verifyToken,
  imgeUpload.uploadImage.single("avatar"),
  adminController.updateAdmin
);
router.delete("/delete-profile/:id", adminController.deleteAdminEmp);

module.exports = router;
