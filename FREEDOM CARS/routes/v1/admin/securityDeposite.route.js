const express = require("express");
const router = express.Router()
const cors = require("cors");
const deposit = require("../../../controller/admin/securityDeposit");
const imageUpload = require("../../../middleware/mediaupload");
const token = require("../../../middleware/tokenVerify")

//get deposit
router.get(
  "/deposit/:id",
  token.verifyAdminToken,
  deposit.getSecurityDeposit
);

router.get(
  "/deposit/",
  token.verifyAdminToken,
  deposit.getSecurityDepositBytoken
);

//add deposit
router.post(
    "/add-deposit",
    imageUpload.upload_securityDepositeImages.single("image"),
    token.verifyAdminToken,
    deposit.addSecurityDeposit
);

module.exports = router;