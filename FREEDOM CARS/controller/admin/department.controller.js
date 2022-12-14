const adminAuthModel = require("../../model/adminAuth");
const branchModel = require("../../model/branch");
const departmentModel = require("../../model/department");

// add dept
exports.addDepartment = function (req, res) {
  try {
    departmentModel
      .findOne({ name: req.body.name })
      .exec(async function (er, dept) {
        if (dept) {
          return res.status(400).json({ message: "Department already exist!" });
        } else {
          const adminn = await adminAuthModel.findOne(
            { _id: req.userId },
            { _id: 1, name: 1 }
          );

          const branchh = await branchModel.findOne(
            { _id: req.body.branchId },
            { _id: 1, branchName: 1 }
          );

          let logDate = new Date().toISOString().slice(0, 10);

          const deptObj = new departmentModel({
            name: req.body.name,
            branchId: req.body.branchId,
            branchName: branchh.branchName,
            adminId: req.userId,
            adminName: adminn.name,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          deptObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "Department could not be added" });
            }
            if (data) {
              res
                .status(200)
                .json({ message: "Department added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get department by id
exports.getDepartmentById = async function (req, res) {
  try {
    const deptResult = await departmentModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", deptResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all departments
exports.getAllDepartments = async function (req, res) {
  try {
    const departmentResult = await departmentModel.find().sort({ name: 1 });

    res.status(200).json({ message: "Success", departmentResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all departments - also used for dept selection
exports.getAllActiveDepartments = async function (req, res) {
  try {
    const departmentResult = await departmentModel
      .find({ status: true })
      .sort({ name: 1 });

    res.status(200).json({ message: "Success", departmentResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit department
exports.editDepartment = async function (req, res) {
  try {
    const branchh = await branchModel.findOne(
      { _id: req.body.branchId },
      { _id: 1, branchName: 1 }
    );

    let logDate = new Date().toISOString().slice(0, 10);

    const changeDeptinfo = await departmentModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          branchId: req.body.branchId,
          branchName: branchh.branchName,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeDeptinfo) {
      res.status(200).json({ message: "Department updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable department
exports.disableDept = async function (req, res) {
  try {
    let logDate = new Date().toISOString().slice(0, 10);

    const disabledepartment = await departmentModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (disabledepartment) {
      res.status(200).json({ message: "Department deactivated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// enable department
exports.enableDept = async function (req, res) {
  try {
    let logDate = new Date().toISOString().slice(0, 10);

    const enabledepartment = await departmentModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: true,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (enabledepartment) {
      res.status(200).json({ message: "Department activated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
