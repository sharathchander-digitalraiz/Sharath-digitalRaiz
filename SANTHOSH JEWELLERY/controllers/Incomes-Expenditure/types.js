const Types = require("../../models/Incomes-Expenditure/types");
const SubCategory = require("../../models/Incomes-Expenditure/subCategory");
const Category = require("../../models/Incomes-Expenditure/category");
const Employee = require("../../models/adminEmp/adminEmpSchema");

//adding data
exports.addtypes = async function (req, res) {
 try {
    const employeeData= await Employee.findById({ _id: req.admin });
    const categoryData = await Category.findById(
      { _id: req.body.category_id },
      { category_name: 1 }
    );
    const subCategoryData = await SubCategory.findById(
      { _id: req.body.subcategory_id },
      { subcategory_name: 1 }
    );
    const typesAdded = new Types({
      category_id: req.body.category_id,
      category_name: categoryData.category_name,
      subcategory_id: req.body.subcategory_id,
      subcategory_name: subCategoryData.subcategory_name,
      amount: req.body.amount,
      description: req.body.description,
      created_by: employeeData.first_name,
      created_log_date: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(400).json({ success: false, message: "An error occurred while saving the data.", Error: err });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Data was successfully saved." });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err  });
  }
};

//get all types details
exports.getAlltypes = async function (req, res) {
  try {
    const typesData = await Types.find({});
    if (typesData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        typesData,
      });
    } else {
      res.status(400).json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err  });
  }
};

//get types by id
exports.getTypesById = async function (req, res) {
  try {
    const typesData = await Types.findById({
      _id: req.params.id,
    });
    if (typesData) {
      res.status(400).json({
        success: true,
        message: "The data was successfully retrieved.",
        typesData,
      });
    } else {
      res.status(400).json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err  });
  }
};

//update types by id
exports.editTypes = async function (req, res) {
  try {
    const employeeData= await Employee.findById({ _id: req.admin });
    const categoryData = await Category.findById(
      { _id: req.body.category_id },
      { category_name: 1 }
    );
    const subCategoryData = await SubCategory.findById(
      { _id: req.body.subcategory_id },
      { subcategory_name: 1 }
    );
    const updatedtypes = await Types.findByIdAndUpdate(
      { _id: req.params.id },
      {
        category_id: req.body.category_id,
        category_name: categoryData.category_name,
        subcategory_id: req.body.subcategory_id,
        subcategory_name: subCategoryData.subcategory_name,
        amount: req.body.amount,
        description: req.body.description,
        modified_by: employeeData.first_name,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (updatedtypes) {
      res.status(400).json({
        success: true,
        message: "Successfully updated data",
      });
    } else {
      res.status(400).json({ success: false, message: "There was no data found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong.", Error: err  });
  }
};
