const { application } = require("express");
const express = require("express");
const router = express.Router();

const paymentController = require("../../controllers/payments/paymentController");

router.get("/payments", paymentController.payments);
router.post("/payments/order", paymentController.orders);
router.post("/payments/verify", paymentController.verify);
module.exports = router;
