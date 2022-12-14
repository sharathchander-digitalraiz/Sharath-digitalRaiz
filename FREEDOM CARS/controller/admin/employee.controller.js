// import libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const adminAuthModel = require("../../model/adminAuth");
const branchModel = require("../../model/branch");
const departmentModel = require("../../model/department");
const employeeAuthModel = require("../../model/employee");
const roleAndPermisionModel = require("../../model/roleAndPermision");

// add employee - register or signup employee
exports.employeeSignup = async function (req, res) {
  //   try {
  employeeAuthModel
    .findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    .exec(async function (er, emploi) {
      if (emploi) {
        return res.status(400).json({ message: "Employee already exist!" });
      } else {
        const adminn = await adminAuthModel.findOne(
          { _id: req.body.adminId },
          { name: 1 }
        );

        const branchh = await branchModel.findOne(
          { _id: req.body.branchId },
          { branchName: 1, branchManagerName: 1 }
        );

        const departmentt = await departmentModel.findOne(
          { _id: req.body.deptId },
          { name: 1 }
        );

        const roles = await roleAndPermisionModel.findOne(
          { _id: req.body.roleId },
          { roleName: 1, rolePermission: 1 }
        );

        let logDate = new Date().toISOString().slice(0, 10);

        const pass = bcrypt.hashSync(req.body.password, 10);

        let permitArr = roles.rolePermission;

        // console.log(permitArr);

        const employeeObj = new employeeAuthModel({
          name: req.body.name,
          email: req.body.email,
          password: pass,
          phone: req.body.phone,
          address: req.body.address,
          deptId: req.body.deptId,
          deptName: departmentt.name,
          roleId: req.body.roleId,
          role: roles.roleName,
          permissions: permitArr,
          branchId: req.body.branchId,
          branchName: branchh.branchName,
          adminId: req.body.adminId,
          adminName: adminn.name,
          createdBy: req.userId,
          joiningDate: req.body.joiningDate,
          logDateCreated: logDate,
          logDateModified: logDate
        });

        employeeObj.save(function (eror, data) {
          if (eror) {
            return res.status(400).json({
              message: "Employee details could not be registered",
              Error: eror
            });
          }
          if (data) {
            res
              .status(200)
              .json({ message: "Employee registered successfully" });
          }
        });
      }
    });
  //   } catch (err) {
  //     res.status(400).json({ message: "Something went wrong..!" });
  //   }
};

// signin employee
exports.employeeSignin = async function (req, res) {
  try {
    const user = await employeeAuthModel.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      { _id: 1, name: 1, email: 1, phone: 1, role: 1, password: 1, status: 1 }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);

      console.log(pass);
      console.log(user);
      if (pass) {
        // generate JWT Token
        let token = jwt.sign(
          {
            userId: user._id,
            password: user.password,
            role: user.role
          },
          process.env.ADMIN_SECRET_KEY,
          { expiresIn: process.env.ADMIN_EXPIRY_DATE }
        );

        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        };
        res.status(200).json({ token: token, user: userData });
      } else {
        res.status(400).json({
          status: 400,
          message: "Invalid user or data"
        });
      }
    } else {
      res.status(404).json({ status: 404, message: "No User Found" });
    }
  } catch (err) {
    // console.log(err);
    res
      .status(400)
      .json({ error: err, status: 500, message: "Invalid email or password" });
  }
};

// get employee profile
exports.getEmployeeById = async function (req, res) {
  try {
    const emplResult = await employeeAuthModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", emplResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all employees
exports.getAllEmployees = async function (req, res) {
  try {
    const employeesResult = await employeeAuthModel
      .find()
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", employeesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active employees
exports.getAllActiveEmployees = async function (req, res) {
  try {
    const actEmplResult = await employeeAuthModel
      .find({ status: true })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", actEmplResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit employee profile
exports.editEmployeeDetails = async function (req, res) {
  try {
    const adminn = await adminAuthModel.findOne(
      { _id: req.body.adminId },
      { name: 1 }
    );

    const branchh = await branchModel.findOne(
      { _id: req.body.branchId },
      { branchName: 1, branchManagerName: 1 }
    );

    const departmentt = await departmentModel.findOne(
      { _id: req.body.deptId },
      { name: 1 }
    );

    const roles = await roleAndPermisionModel.findOne(
      { _id: req.body.roleId },
      { roleName: 1, rolesAndPermission: 1 }
    );

    let logDate = new Date().toISOString().slice(0, 10);

    const changeEmployeeInfo = await employeeAuthModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          deptId: req.body.deptId,
          deptName: departmentt.name,
          // roleId: req.body.roleId,
          // role: roles.roleName,
          // permissions: roles.rolesAndPermission,
          branchId: req.body.branchId,
          branchName: branchh.branchName,
          adminId: req.body.adminId,
          adminName: adminn.name,
          createdBy: req.userId,
          joiningDate: req.body.joiningDate,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeEmployeeInfo) {
      res
        .status(200)
        .json({ message: "Employee details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable or deactivate employee
exports.disableEmployee = async function (req, res) {
  try {
    const disableEmp = await employeeAuthModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false
        }
      },
      { new: true }
    );

    if (disableEmp) {
      res.status(200).json({ message: "Employee disabled successfully" });
    }
  } catch (err) {
    res.status(200).json({ message: "Something went wrong..!" });
  }
};

// enable employee status or activate employee
exports.enableEmployee = async function (req, res) {
  try {
    const enableEmp = await employeeAuthModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: true
        }
      },
      { new: true }
    );

    if (enableEmp) {
      res.status(200).json({ message: "Employee enabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
