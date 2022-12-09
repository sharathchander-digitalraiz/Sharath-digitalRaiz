const CastingAdmin = require("../../../models/order_management/Admin/castingAdmin");
const DeptModel = require("../../../models/adminEmp/departments");
const employee = require("../../../models/adminEmp/adminEmpSchema");

//add CastingAdmin
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
    const bandiniAdded = new CastingAdmin({
      date: req.body.date,
      department_Id: req.body.department_Id,
      designation: deptData.deptName,
      employee_id: req.body.employee_id,
      employee_name: empData.first_name,
      weight_out: req.body.weight_out,
      finish_in: req.body.finish_in,
      scrap_in: req.body.scrap_in,
      loss: req.body.loss,
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

//update CastingAdmin
exports.updateCastingAdmin = async function (req, res) {
  try {
    const deptData = await DeptModel.findById(
      { _id: req.body.department_Id },
      { deptName: 1 }
    );
    const empData = await employee.findById(
      { _id: req.body.employee_id },
      { first_name: 1 }
    );
    const CastingAdminUpdated = await CastingAdmin.findByIdAndUpdate(
      { _id: req.params.id },
      {
        date: req.body.date,
        department_Id: req.body.department_Id,
        designation: deptData.deptName,
        employee_id: req.body.employee_id,
        employee_name: empData.first_name,
        weight_out: req.body.weight_out,
        finish_in: req.body.finish_in,
        scrap_in: req.body.scrap_in,
        loss: req.body.loss,
      }
    );
    if (CastingAdminUpdated) {
      res.status(400).json({
        success: true,
        message: "updated successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingAdmin not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get CastingAdmin
exports.getCastingAdmin = async function (req, res) {
  try {
    const CastingAdminData = await CastingAdmin.findById({
      _id: req.params.id,
    });
    if (CastingAdminData) {
      res.status(400).json({
        success: true,
        message: "success",
        CastingAdminData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingAdmin data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//Get All Casting Admin
exports.getAllCastingAdmin = async function (req, res) {
  try {
    const CastingAdminsData = await CastingAdmin.find();
    if (CastingAdminsData) {
      res.status(400).json({
        success: true,
        message: "successfull",
        CastingAdminsData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingAdmin data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete CastingAdmin
exports.deleteCastingAdmin = async function (req, res) {
  try {
    const CastingAdminDeleted = await CastingAdmin.findByIdAndDelete({
      _id: req.params.id,
    });
    if (CastingAdminDeleted) {
      res.status(400).json({
        success: true,
        message: "CastingAdmin data deleted successfull",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "CastingAdmin data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
