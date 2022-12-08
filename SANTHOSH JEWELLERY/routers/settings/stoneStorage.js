const express = require("express");
const router = express.Router();
const tokenVerify = require("../../middlewares/verifyToken");

//items controllers
const stoneStorage = require("../../controllers/settings/stoneStorage.controller");

//items routes
router.get("/all-stone-storage", tokenVerify.verifyToken, stoneStorage.getAllstones);
router.get("/search-stone-storage/:id", tokenVerify.verifyToken, stoneStorage.getOneStone);
router.post("/add-stone-storage", tokenVerify.verifyToken, stoneStorage.addStoneStorage);
router.put("/edit-stone-storage/:id", tokenVerify.verifyToken, stoneStorage.editStoneStorge);
router.delete("/remove-stone-storage/:id", tokenVerify.verifyToken, stoneStorage.deleteStone);

module.exports = router;
