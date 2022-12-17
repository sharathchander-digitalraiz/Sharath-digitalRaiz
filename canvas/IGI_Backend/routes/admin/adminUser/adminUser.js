const express = require("express");
const router = express.Router();

// importing the required functions
const { verifyToken } = require("../../../commonMiddleWare");
const {
  addAdminUser,
  getAdminUser,
  getAllAdminUsers,
  editAdminUser,
  removeAdminUser,
} = require("../../../controller/admin/adminUser/adsminUser");
const {
  validateAdminUser,
  isRequestvalidateAdminUser,
} = require("../../../validator/adminUser");

// defining the routes
router.post(
  "/admin/igiindia/addadminuser",
  verifyToken,
  validateAdminUser,
  isRequestvalidateAdminUser,
  addAdminUser
);

router.post("/admin/igiindia/getadminuser", verifyToken, getAdminUser);

router.get("/admin/igiindia/getalladminusers", verifyToken, getAllAdminUsers);

router.put("/admin/igiindia/editadminuser/:id", verifyToken, editAdminUser);

router.delete(
  "/admin/igiindia/removeadminuser/:id",
  verifyToken,
  removeAdminUser
);

module.exports = router;
