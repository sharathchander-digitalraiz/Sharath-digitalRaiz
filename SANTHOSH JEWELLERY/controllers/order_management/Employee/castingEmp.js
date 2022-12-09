const CastingEmp = require("../../../models/order_management/Employee/castingEmp");
const DeptModel = require("../../../models/adminEmp/departments");
const employee = require("../../../models/adminEmp/adminEmpSchema");


//add CastingEmp
exports.addBandini = async function (req, res) {
  try {
    const deptData = await DeptModel.findById(
      { _id: req.body.department_Id },
      { deptName: 1 }
    );
    const empData = await employee.findById(
      { _id: req.body.employee_id },
      { first_name: 1 }
    );

    const bandiniAdded = new CastingEmp({
      date: req.body.date,
      karigar: req.body.date,
      item_wt_add: req.body.item_wt_add,
      stone: req.body.stone,
      net_weight: req.body.net_weight,
      status: ["Started", "Completed"],
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({ success: false, message: err });
      } else {
        res.status(400).json({ success: true, message: "successfull" });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get the list of employees based on dept id
exports.getEmpWithDept = async (req, res) => {
  try {
    const empData = employee.find(
      { department_Id: req.body._id },
      { first_name: 1 }
    );
    res.status(200).json({ success: true, message: "success", empData });
  } catch (err) {
    res.status(400).json({ success: false, message: "bad request" });
  }
};

//update CastingEmp
exports.updateCastingEmp = async function (req, res) {
  try {
    const deptData = await DeptModel.findById(
      { _id: req.body.department_Id },
      { deptName: 1 }
    );
    const empData = await employee.findById(
      { _id: req.body.employee_id },
      { first_name: 1 }
    );
    const CastingEmpUpdated = await CastingEmp.findByIdAndUpdate(
      { _id: req.params.id },
      {
        date: req.body.date,
        department_Id: req.body.department_Id,
        designation: deptData.deptName,
        employee_id: req.body.employee_id,
        employee_name: empData.first_name,
        item_wt_removed: req.body.item_wt_removed,
      }
    );
    if (CastingEmpUpdated) {
      res.status(400).json({
        success: true,
        message: "updated successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingEmp not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get CastingEmp
exports.getCastingEmp = async function (req, res) {
  try {
    const CastingEmpData = await CastingEmp.findById({
      _id: req.params.id,
    });
    if (CastingEmpData) {
      res.status(400).json({
        success: true,
        message: "success",
        CastingEmpData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingEmp data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//getAll CastingEmp
exports.getAllCastingEmp = async function (req, res) {
  try {
    const CastingEmpsData = await CastingEmp.find();
    if (CastingEmpsData) {
      res.status(400).json({
        success: true,
        message: "successfull",
        CastingEmpsData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingEmp data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete CastingEmp
exports.deleteCastingEmp = async function (req, res) {
  try {
    const CastingEmpDeleted = await CastingEmp.findByIdAndDelete({
      _id: req.params.id,
    });
    if (CastingEmpDeleted) {
      res.status(400).json({
        success: true,
        message: "CastingEmp data deleted successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingEmp data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

