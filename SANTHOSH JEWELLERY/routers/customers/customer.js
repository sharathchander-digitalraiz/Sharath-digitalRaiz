const express = require("express");
const router = express.Router();

//middlewares
const verifyToken = require("../../middlewares/verifyToken");

//controllers
const customerController = require("../../controllers/customers/customerController");

//qr
const customerQr = require("../../controllers/qrcode/qrcode")

//API calls
router.post(
  "/add-customer",
  verifyToken.verifyToken,
  customerController.addCustomer
);
router.put(
  "/edit-customer-details/:id",
  verifyToken.verifyToken,
  customerController.updateCustomer
);
router.get(
  "/customer-details/:id",
  verifyToken.verifyToken,
  customerController.getCustomer
);

router.get(
  "/list-customers",
  verifyToken.verifyToken,
  customerController.getAllCustomer
);

router.get(
  "/customer-details-qr/:id",                     
  customerQr.customerQrCode
);
module.exports = router;
