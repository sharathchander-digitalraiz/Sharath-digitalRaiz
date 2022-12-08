const BandiniEmp = require("../../../models/order_management/Employee/bandiniEmp");
const DeptModel = require("../../../models/adminEmp/departments");
const employee = require("../../../models/adminEmp/adminEmpSchema");


//add BandiniAdmin
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

    const bandiniAdded = new BandiniAdmin({
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

//update BandiniAdmin
exports.updateBandiniAdmin = async function (req, res) {
  try {
    const deptData = await DeptModel.findById(
      { _id: req.body.department_Id },
      { deptName: 1 }
    );
    const empData = await employee.findById(
      { _id: req.body.employee_id },
      { first_name: 1 }
    );
    const BandiniAdminUpdated = await BandiniAdmin.findByIdAndUpdate(
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
    if (BandiniAdminUpdated) {
      res.status(400).json({
        success: true,
        message: "updated successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniAdmin not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get BandiniAdmin
exports.getBandiniAdmin = async function (req, res) {
  try {
    const BandiniAdminData = await BandiniAdmin.findById({
      _id: req.params.id,
    });
    if (BandiniAdminData) {
      res.status(400).json({
        success: true,
        message: "success",
        BandiniAdminData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniAdmin data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//getAll BandiniAdmin
exports.getAllBandiniAdmin = async function (req, res) {
  try {
    const BandiniAdminsData = await BandiniAdmin.find();
    if (BandiniAdminsData) {
      res.status(400).json({
        success: true,
        message: "successfull",
        BandiniAdminsData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniAdmin data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete BandiniAdmin
exports.deleteBandiniAdmin = async function (req, res) {
  try {
    const BandiniAdminDeleted = await BandiniAdmin.findByIdAndDelete({
      _id: req.params.id,
    });
    if (BandiniAdminDeleted) {
      res.status(400).json({
        success: true,
        message: "BandiniAdmin data deleted successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "BandiniAdmin data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

