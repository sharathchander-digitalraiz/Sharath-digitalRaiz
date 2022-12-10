const express = require("express");
const router = express.Router();

//verify token
const token = require("../../middlewares/verifyToken");

//controllers
const subCategory = require("../../controllers/Incomes-Expenditure/subCategory");

//API calls
router.post("/add-sub-category", token.verifyToken, subCategory.addSubCategory);
router.get("/all-sub-category", token.verifyToken, subCategory.getAllSubCategory);
router.get("/search-sub-category/:id", token.verifyToken, subCategory.getSubCategoryById);
router.put("/edit-sub-category/:id", token.verifyToken, subCategory.editSubCategory);

module.exports = router;


