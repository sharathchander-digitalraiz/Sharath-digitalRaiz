const express = require("express");
const router = express.Router();
const features = require("../../../controller/admin/feature.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");
const { verifyAdminToken } = require("../../../middleware/tokenVerify");

router.post(
  "/getallCarfeatures",
  verifyAdminToken,
  upload_userImages.none(),
  features.getallCarfeatures
);
router.post(
  "/new",
  verifyAdminToken,
  upload_userImages.none(),
  features.new_feature
);
router.post(
  "/getallactivefeatures",
  verifyAdminToken,
  upload_userImages.none(),
  features.getAllActiveFeatures
);
router.put(
  "/edit/:id",
  verifyAdminToken,
  upload_userImages.none(),
  features.edit_feature
);
router.put(
  "/delete/:id",
  verifyAdminToken,
  upload_userImages.none(),
  features.delete_feature
);

module.exports = router;
