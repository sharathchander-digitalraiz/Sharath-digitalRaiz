const express = require("express");
const router = express.Router();

//verify token
const token = require("../../middlewares/verifyToken");

//controllers
const types = require("../../controllers/Incomes-Expenditure/types");

//API calls
router.post("/add-types", token.verifyToken, types.addtypes);
router.get("/all-types", token.verifyToken, types.getAlltypes);
router.get("/search-types/:id", token.verifyToken, types.getTypesById);
router.put("/edit-types/:id", token.verifyToken, types.editTypes);

module.exports = router;