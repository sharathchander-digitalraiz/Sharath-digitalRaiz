const express = require("express");
const router = express.Router();

//controllers
const infra = require("../controller/infra");

//API calls
router.post("/add-infra", infra.addInfra);
router.get("/all-infra", infra.getInfra);

module.exports = router;