const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const adminAuthModel = require("../../model/adminAuth");
const branchModel = require("../../model/branch");
const superadminModel = require("../../model/superadminAuth");

// branch manager register or signup
exports.branchMngrSignup = function (req, res) {
  try {
    branchModel
      .findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
      .exec(async function (er, user) {
        if (user) {
          return res.status(400).json({ message: "User already exist!" });
        } else {
          const adminn = await adminAuthModel.findOne(
            { _id: req.userId },
            { _id: 1, name: 1 }
          );

          const superadminn = await superadminModel.findOne(
            {},
            { _id: 1, firstName: 1, lastName: 1 }
          );

          const pass = bcrypt.hashSync(req.body.password, 10);

          let logDate = new Date().toISOString().slice(0, 10);

          const adminObj = new branchModel({
            branchName: req.body.branchName,
            branchManagerName: req.body.branchManagerName,
            email: req.body.email,
            password: pass,
            phone: req.body.phone,
            address: req.body.address,
            superAdminId: superadminn._id,
            superAdminName: `${superadminn.firstName} ${superadminn.lastName}`,
            adminId: req.userId,
            adminName: adminn.name,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          adminObj.save(function (eror, userData) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "User data could not be saved", Error: eror });
            }
            if (userData) {
              res.status(200).json({ message: "User added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// branch manager Login / Sign in
exports.branchMngrSignin = async function (req, res) {
  try {
    const user = await branchModel.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      { _id: 1, name: 1, email: 1, phone: 1, role: 1, password: 1, status: 1 }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);

      console.log(pass);
      console.log(user);
      if (pass && user.role == "branchManager") {
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
