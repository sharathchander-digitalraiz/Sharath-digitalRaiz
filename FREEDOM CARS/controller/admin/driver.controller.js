// import libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const driverModel = require("../../model/driver");
const adminAuthModel = require("../../model/adminAuth");
const employeeModel = require("../../model/employee");
const branchModel = require("../../model/branch");

// add - signup Driver
exports.driverSignup = function (req, res) {
  try {
    driverModel
      .findOne({
        $or: [
          { email: req.body.email },
          { phone: req.body.phone },
          { dlNumber: req.body.dlNumber }
        ]
      })
      .exec(async function (er, cust) {
        if (cust) {
          return res.status(400).json({ message: "Driver already exist!" });
        } else {
          const adminn = await adminAuthModel.findOne(
            { _id: req.body.adminId },
            { name: 1 }
          );

          const branchh = await branchModel.findOne(
            { _id: req.body.branchId },
            { branchName: 1 }
          );

          const pass = bcrypt.hashSync(req.body.password, 10);

          let logDate = new Date().toISOString();

          const custObj = new driverModel({
            driverName: req.body.driverName,
            dlNumber: req.body.dlNumber,
            email: req.body.email,
            password: pass,
            phone: req.body.phone,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            city: req.body.city,
            stateName: req.body.stateName,
            countryName: req.body.countryName,
            countryCode: req.body.countryCode,
            zipCode: req.body.zipCode,
            membershipType: req.body.membershipType,
            adminId: req.body.adminId
              ? req.body.adminId
              : console.log("No admin id"),
            adminName: req.body.adminId
              ? adminn.name
              : console.log("No admin name"),
            branchId: req.body.branchId
              ? req.body.branchId
              : console.log("No branch id"),
            branchName: req.body.branchId
              ? branchh.branchName
              : console.log("No branch name"),
            residentStatus: req.body.residentStatus,
            occupation: req.body.occupation,
            occupationdetails: req.body.occupationdetails,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          custObj.save(function (eror, datta) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "Driver details could not be added", Error: eror });
            }
            if (datta) {
              res
                .status(200)
                .json({ message: "Driver details added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Invalid admin or branch data..!" });
  }
};

// Driver signin
exports.driverSignin = async function (req, res) {
  try {
    const user = await driverModel.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      { _id: 1, driverName: 1, email: 1, phone: 1, password: 1, isBlocked: 1 }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);

      console.log(pass);
      console.log(user);
      if (pass && user.isBlocked == false) {
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
          role: "driver"
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

// get Driver details
exports.getDriverDetails = async function (req, res) {
  try {
    const custResult = await driverModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", custResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all Drivers list - for admin
exports.getAllDrivers = async function (req, res) {
  try {
    const custsResult = await driverModel.find().sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", custsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active Drivers list
exports.getAllActiveDrivers = async function (req, res) {
  try {
    const custActiveResult = await driverModel.find({ isBlocked: false });

    res.status(200).json({ message: "Success", custActiveResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all verified Drivers list
exports.getAllVerifiedDrivers = async function (req, res) {
  try {
    const custVerifiedResult = await driverModel.find({ status: true });

    res.status(200).json({ message: "Success", custVerifiedResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update Driver details
exports.editDriverDetails = async function (req, res) {
  try {
    const adminn = await adminAuthModel.findOne(
      { _id: req.body.adminId },
      { name: 1 }
    );

    const branchh = await branchModel.findOne(
      { _id: req.body.branchId },
      { branchName: 1 }
    );

    let logDate = new Date().toISOString();

    const changeCust = await driverModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          driverName: req.body.driverName,
          dlNumber: req.body.dlNumber,
          email: req.body.email,
          phone: req.body.phone,
          dateOfBirth: req.body.dateOfBirth,
          address: req.body.address,
          city: req.body.city,
          stateName: req.body.stateName,
          countryName: req.body.countryName,
          countryCode: req.body.countryCode,
          zipCode: req.body.zipCode,
          membershipType: req.body.membershipType,
          adminId: req.body.adminId
            ? req.body.adminId
            : console.log("No admin id"),
          adminName: req.body.adminId
            ? adminn.name
            : console.log("No admin name"),
          branchId: req.body.branchId
            ? req.body.branchId
            : console.log("No branch id"),
          branchName: req.body.branchId
            ? branchh.branchName
            : console.log("No branch name"),
          residentStatus: req.body.residentStatus,
          occupation: req.body.occupation,
          occupationdetails: req.body.occupationdetails,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCust) {
      res
        .status(200)
        .json({ message: "Driver details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// update verifcation details
exports.verifyDriverDetails = async function (req, res) {
//   try {
    let logDate = new Date().toISOString();

    const changeCustVerfyDetails = await driverModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          emailVerify: req.body.emailVerify,
          phoneVerify: req.body.phoneVerify,
          faceVerify: req.body.faceVerify,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCustVerfyDetails) {
      const showDriver = await driverModel.findOne(
        { _id: req.params.id },
        { emailVerify: 1, phoneVerify: 1, faceVerify: 1 }
      );

      let custStatus;
      if (
        showDriver.emailVerify == true &&
        showDriver.phoneVerify == true &&
        showDriver.faceVerify == true
      ) {
        custStatus = await driverModel.updateOne(
          { _id: req.params.id },
          {
            $set: {
              status: true,
              logDateModified: logDate
            }
          },
          { new: true }
        );
      } else {
        custStatus = await driverModel.updateOne(
          { _id: req.params.id },
          {
            $set: {
              status: false,
              logDateModified: logDate
            }
          },
          { new: true }
        );
      }

      res
        .status(200)
        .json({ message: "Driver verification updated successfully" });
    }
//   } catch (err) {
//     res.status(400).json({ message: "Something went wrong..!" });
//   }
};

// manually verify Driver
exports.verifyCustManually = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const custStatus = await driverModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (custStatus) {
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable Driver
exports.disableDriver = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeCust = await driverModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isBlocked: true,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCust) {
      res.status(200).json({ message: "Driver disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// enable Driver
exports.enableDriver = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeCust = await driverModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isBlocked: false,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCust) {
      res.status(200).json({ message: "Driver disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
