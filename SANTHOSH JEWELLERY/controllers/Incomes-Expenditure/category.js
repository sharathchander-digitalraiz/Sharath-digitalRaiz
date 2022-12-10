const Category = require("../../models/Incomes-Expenditure/category");
const Employee = require("../../models/adminEmp/adminEmpSchema");

//adding data
exports.addCategory = async function (req, res) {
  try {
    const employeeData= await Employee.findById({ _id: req.admin });
    const CategoryAdded = new Category({
      category_name: req.body.category_name,
      created_by: employeeData.first_name,
      created_log_date: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({ success: false, message: "An error occurred while saving the data.", Error: err  });
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

//get all types Category
exports.getAllCategory = async function (req, res) {
  try {
    const CategoryData = await Category.find({});
    if (CategoryData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        CategoryData,
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

//get Category by id
exports.getCategoryById = async function (req, res) {
  try {
    const CategoryData = await Category.findById({ _id: req.params.id });
    if (CategoryData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        CategoryData,
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

//update Category by id
exports.editCategory = async function (req, res) {
  try {
    const employeeData= await Employee.findById({ _id: req.admin });
    const data =employeeData.first_name;
    const CategoryUpdated = await Category.findByIdAndUpdate({_id: req.params.id,},
      {
        category_name: req.body.category_name,
        modified_by: data,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (CategoryUpdated) {
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
