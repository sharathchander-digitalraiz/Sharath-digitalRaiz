const Transaction = require("../../models/Incomes-Expenditure/transaction");
const Employee = require("../../models/adminEmp/adminEmpSchema");

//adding data
exports.addTransaction = async function (req, res) {
  try {
    const employeeData = await Employee.findById({ _id: req.admin });
    const TransactionAdded = new Transaction({
      date: req.body.date,
      category_id: req.body.category_id,
      subCategory_id: req.body.subCategory_id,
      type_id: req.body.type_id,
      transaction_name: req.body.transaction_name,
      type: req.body.type,
      remarks: req.body.remarks,
      created_by: employeeData.first_name,
      created_log_date: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({
          success: false,
          message: "An error occurred while saving the data.",
          Error: err,
        });
      } else {
        res
          .status(400)
          .json({ success: true, message: "Data was successfully saved. " });
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//get all types Transaction
exports.getAllTransaction = async function (req, res) {
  try {
    const TransactionData = await Transaction.find({});
    if (TransactionData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        TransactionData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "There was no data found. " });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//get transaction by id
exports.getTransactionById = async function (req, res) {
  try {
    const TransactionData = await Transaction.findById({ _id: req.params.id });
    if (TransactionData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        TransactionData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//update Transaction by id
exports.editTransaction = async function (req, res) {
  try {
    const employeeData = await Employee.findById({ _id: req.admin });
    const TransactionUpdated = await Transaction.findByIdAndUpdate(
      { _id: req.params.id },
      {
        date: req.body.date,
        category_id: req.body.category_id,
        subCategory_id: req.body.subCategory_id,
        type_id: req.body.type_id,
        transaction_name: req.body.transaction_name,
        type: req.body.type,
        remarks: req.body.remarks,
        modified_by: employeeData.first_name,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (TransactionUpdated) {
      res.status(400).json({
        success: true,
        message: "Successfully updated data ",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};
