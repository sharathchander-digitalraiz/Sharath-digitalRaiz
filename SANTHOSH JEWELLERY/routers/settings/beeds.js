const express = require("express")
const router = express.Router();
const tokenVerify = require("../../middlewares/verifyToken");

//beeds controllers
const beeds = require("../../controllers/settings/beeds.controller");

//items routes
router.get("/all-beeds", tokenVerify.verifyToken, beeds.getAllBeeds);
router.get("/search-beeds/:id", tokenVerify.verifyToken, beeds.getOneBeed);
router.post("/add-beeds", tokenVerify.verifyToken, beeds.addBeeds);
router.put("/edit-beeds/:id", tokenVerify.verifyToken, beeds.editBeeds);
router.delete("/remove-beeds/:id", tokenVerify.verifyToken, beeds.deleteBeeds);


module.exports = router;