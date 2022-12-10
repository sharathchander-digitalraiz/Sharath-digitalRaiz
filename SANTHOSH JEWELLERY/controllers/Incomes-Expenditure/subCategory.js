const SubCategory = require("../../models/Incomes-Expenditure/subCategory")
const Category = require("../../models/Incomes-Expenditure/category");
const Employee = require("../../models/adminEmp/adminEmpSchema");

//adding data
exports.addSubCategory = async function (req, res) {
  try {
    const employeeData= await Employee.findById({ _id: req.admin });
    const categoryData = await Category.findById(
      { _id: req.body.category_id },
      { category_name: 1 }
    );
    const SubCategoryAdded = new SubCategory({
      category_id: req.body.category_id,
      category_name: categoryData.category_name,
      subcategory_name: req.body.subcategory_name,
      created_by: employeeData.first_name,
      created_log_date: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({ success: false, message: "An error occurred while saving the data.", Error: err });
      } else {
        res
          .status(400)
          .json({ success: true, message: "Data was successfully saved." });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//get all SubCategory
exports.getAllSubCategory = async function (req, res) {
  try {
    const SubCategoryData = await SubCategory.find({});
    if (SubCategoryData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        SubCategoryData,
      });
    } else {
      res.status(400).json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err  });
  }
};

//get SubCategory by id
exports.getSubCategoryById = async function (req, res) {
  try {
    const SubCategoryData = await SubCategory.findById({ _id: req.params.id });
    if (SubCategoryData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        SubCategoryData,
      });
    } else {
      res.status(400).json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res.status(400).json({ success: false,message: "Something went wrong.", Error: err });
  }
};

//update SubCategory by id
exports.editSubCategory = async function (req, res) {
  try {
    const employeeData= await Employee.findById({ _id: req.admin });
    const categoryData = await Category.findById(
      { _id: req.body.category_id },
      { category_name: 1 }
    );
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      { _id: req.params.id },
      {
        category_id: req.body.category_id,
        category_name: categoryData.category_name,
        subcategory_name: req.body.subcategory_name,
        modified_by: employeeData.first_name,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (updatedSubCategory) {
      res.status(400).json({
        success: true,
        message: "Successfully updated data ",
      });
    } else {
      res.status(400).json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err  });
  }
};
