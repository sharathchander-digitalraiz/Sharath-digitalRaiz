const express = require("express");
const router = express.Router();
const tokenVerify = require("../../middlewares/verifyToken");
//items controllers
const itemType = require("../../controllers/settings/itemType.controller");

//items routes
router.get("/all-items-type", tokenVerify.verifyToken, itemType.getAllItems);
router.get("/search-items-type/:id", tokenVerify.verifyToken, itemType.getOneItem);
router.post("/add-items-type", tokenVerify.verifyToken, itemType.addItem);
router.put("/edit-items-type/:id", tokenVerify.verifyToken, itemType.editItem);
router.delete("/remove-items-type/:id", tokenVerify.verifyToken, itemType.deleteItem);


module.exports = router;
