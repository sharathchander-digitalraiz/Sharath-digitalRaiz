const express = require("express");
const router = express.Router();

//verify token
const token = require("../../middlewares/verifyToken");

//controllers
const category = require("../../controllers/Incomes-Expenditure/category");

//API calls
router.post("/add-category", token.verifyToken, category.addCategory);
router.get("/all-category", token.verifyToken, category.getAllCategory);
router.get("/search-category/:id", token.verifyToken, category.getCategoryById);
router.put("/edit-category/:id", token.verifyToken, category.editCategory);

module.exports = router;
