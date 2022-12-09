const BandiniEmp = require("../../../models/order_management/Employee/bandiniEmp");
const DeptModel = require("../../../models/adminEmp/departments");
const employee = require("../../../models/adminEmp/adminEmpSchema");


//add BandiniEmp
exports.addBandini = async function (req, res) {
  try {
    const bandiniAdded = new BandiniEmp({
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

//update BandiniEmp
exports.updateBandiniEmp = async function (req, res) {
  try {
    const deptData = await DeptModel.findById(
      { _id: req.body.department_Id },
      { deptName: 1 }
    );
    const empData = await employee.findById(
      { _id: req.body.employee_id },
      { first_name: 1 }
    );
    const BandiniEmpUpdated = await BandiniEmp.findByIdAndUpdate(
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
    if (BandiniEmpUpdated) {
      res.status(400).json({
        success: true,
        message: "updated successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniEmp not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get BandiniEmp
exports.getBandiniEmp = async function (req, res) {
  try {
    const BandiniEmpData = await BandiniEmp.findById({
      _id: req.params.id,
    });
    if (BandiniEmpData) {
      res.status(400).json({
        success: true,
        message: "success",
        BandiniEmpData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniEmp data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//getAll BandiniEmp
exports.getAllBandiniEmp = async function (req, res) {
  try {
    const BandiniEmpsData = await BandiniEmp.find();
    if (BandiniEmpsData) {
      res.status(400).json({
        success: true,
        message: "successfull",
        BandiniEmpsData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniEmp data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete BandiniEmp
exports.deleteBandiniEmp = async function (req, res) {
  try {
    const BandiniEmpDeleted = await BandiniEmp.findByIdAndDelete({
      _id: req.params.id,
    });
    if (BandiniEmpDeleted) {
      res.status(400).json({
        success: true,
        message: "BandiniEmp data deleted successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniEmp data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
