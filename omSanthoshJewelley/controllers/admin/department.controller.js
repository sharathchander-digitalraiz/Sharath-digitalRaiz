const adminAuthModel = require("../../models/adminEmps");
const Department = require("../../models/departments");

// add dept
exports.addDepartment = function (req, res) {
  try {
    Department
      .findOne({ departmentName: req.body.departmentName })
      .exec(async function (err, dept) {
        if (dept) {
          return res.status(400).json({ success:false,message: "The department already exists!" });
        } else {
          const adminn = await adminAuthModel.findOne(
            { _id: req.userId },
            { _id: 1, name: 1 }
          );

          let logDate = new Date().toISOString().slice(0, 10);

          const deptObj = new Department({
            departmentName: req.body.departmentName,
            adminName: adminn.name,
            createdBy: req.userId,
            logDateCreated: logDate,
          }).save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({
                  success: false,
                  message:
                    "The department could not be added due to a bad request.",
                });
            }
            if (data) {
              res
                .status(200)
                .json({
                  success: true,
                  message: "Department has been successfully added.",
                });
            }
          });
        }
      });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!" });
  }
};

//find by department name
exports.getDepartmentByName = async function (req, res) {
  try {
    const findName = new RegExp(req.body.name,"i")
    const deptResult = await departmentModel.find({name:findName});
    if(deptResult){req.body.name
      res.status(200).json({ message: "successfully retrieved the department data.", deptResult });
    }else{
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false,message: "Something went wrong!" });
  }
};

// get department by id
exports.getDepartmentById = async function (req, res) {
  try {
    const deptResult = await departmentModel.findById({ _id: req.body._id });
    if(deptResult){
      res.status(200).json({ message: "successfully retrieved the department data.", deptResult });
    }else{
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false,message: "Something went wrong!" });
  }
};

// get all departments
exports.getAllDepartments = async function (req, res) {
  try {
    const departmentResult = await departmentModel.find().sort({ name: 1 });
    if(departmentResult){
      res.status(200).json({ message: "successfully retrieved the department data.", departmentResult });
    }else{
      res.status(400).json({ success: false, message: "Bad request", });
    }
  } catch (err) {
    res.status(400).json({ success: false,message: "Something went wrong!" });
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
    // const branchh = await branchModel.findOne(
    //   { _id: req.body.branchId },
    //   { _id: 1, branchName: 1 }
    // );
    let logDate = new Date().toISOString().slice(0, 10);

    const changeDeptinfo = await departmentModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          departmentName: req.body.departmentName,
          // branchId: req.body.branchId,
          // branchName: branchh.branchName,
          logDateModified: logDate,
        },
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
          logDateModified: logDate,
        },
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
          logDateModified: logDate,
        },
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
