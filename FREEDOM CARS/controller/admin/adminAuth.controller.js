// import libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const adminAuthModel = require("../../model/adminAuth");
const superadminModel = require("../../model/superadminAuth");

// admin register or signup
exports.adminSignup = function (req, res) {
  try {
    adminAuthModel
      .findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
      .exec(async function (er, user) {
        if (user) {
          return res.status(400).json({ message: "User already exist!" });
        } else {
          const superadminn =  superadminModel.findOne(
            {},
            { _id: 1, firstName: 1, lastName: 1 }
          );

          const pass = bcrypt.hashSync(req.body.password, 10);

          let logDate = new Date().toISOString().slice(0, 10);

          const adminObj = new adminAuthModel({
            name: req.body.name,
            email: req.body.email,
            password: pass,
            phone: req.body.phone,
            superAdminId: superadminn._id,
            superAdminName: `${superadminn.firstName} ${superadminn.lastName}`,
            address: req.body.address,
            logDateCreated: logDate,
            logDateModified: logDate,
            planType: req.body.planType
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

// admin Login / Sign in
exports.adminSignin = async function (req, res) {
  try {
    const user = await adminAuthModel.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      { _id: 1, name: 1, email: 1, phone: 1, role: 1, password: 1, status: 1 }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);

      console.log(pass);
      console.log(user);
      if (pass && user.role == "admin") {
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

// get admin profile
exports.getAdminProfile = async function (req, res) {
  try {
    const profileResult = await adminAuthModel.findOne({ _id: req.userId });

    res.status(200).json({ message: "Success", profileResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update profile
exports.editProfile = async function (req, res) {
  try {
    let logDate = new Date().toISOString().slice(0, 10);

    const updateProfile = await adminAuthModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          profilePic: req.file ? req.file.path : console.log("No Img"),
          address: req.body.address,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (updateProfile) {
      res.status(200).json({ message: "Profile updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// change - update password
exports.update_password = async (req, res, next) => {
  try {
    // console.log(req.body);
    const password = req.body.old_password;
    const newpassword = req.body.new_password;
    const confirmpassword = req.body.confirm_password;

    console.log(req.userId);
    if (password == null || password == undefined || password == "") {
      return res.status(404).json({ message: "Please enter current password" });
    }

    console.log(req.userId);

    const userPass = await adminAuthModel.findOne(
      { _id: req.userId },
      { password: 1 }
    );

    let currentPassVal = bcrypt.compareSync(password, userPass.password);

    if (currentPassVal == true) {
      if (newpassword == confirmpassword) {
        const bcruptedPassword = bcrypt.hashSync(confirmpassword, 10);

        await adminAuthModel.updateOne(
          { _id: req.userId },
          { $set: { password: bcruptedPassword } },
          { new: true }
        );
        res.status(200).json({ message: "Password updated successfully" });
      } else {
        res.status(404).json({ message: "passwords does not match" });
      }
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error });
  }
};

// update profile image
exports.editProfileImage = async function (req, res) {
  try {
    const updateImage = await adminAuthModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          profilePic: req.file.path
        }
      },
      { new: true }
    );

    if (updateImage) {
      res.status(200).json({ message: "Profile image updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
