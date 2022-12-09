const express = require("express");
const router = express.Router();

//controllers
const purchases = require("../controller/purchases");

//API calls
router.post("/add-purchase", purchases.addComputerPurchase);
router.get("/all-purchase", purchases.getPurchases);

module.exports = router;