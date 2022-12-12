const express = require("express");
const router = express.Router();

//verify token
const token = require("../../middlewares/verifyToken");

//controllers
const transaction = require("../../controllers/Incomes-Expenditure/transaction");

//API calls
router.post("/add-transaction", token.verifyToken, transaction.addTransaction);
router.get("/all-transactions", token.verifyToken, transaction.getAllTransaction);
router.get("/search-transaction/:id", token.verifyToken, transaction.getTransactionById);
router.put("/edit-transaction/:id", token.verifyToken, transaction.editTransaction);

module.exports = router;