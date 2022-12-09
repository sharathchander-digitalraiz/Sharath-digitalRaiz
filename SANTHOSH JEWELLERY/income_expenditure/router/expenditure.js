const express = require("express");
const router = express.Router();

//controllers
const expenditure = require("../controller/expenditure");

//API calls
router.post("/add-expenditure", expenditure.addExp);
router.get("/all-expenditure", expenditure.getExp);

module.exports = router;
