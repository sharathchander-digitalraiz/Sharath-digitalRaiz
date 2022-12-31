const AdminEmpModel = require("../models/adminEmpModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//adding admin
exports.addUser = function (req, res) {
  try {
    AdminEmpModel.findOne({ email: req.body.email }).exec((err, admin) => {
      if (admin) {
        return res
          .status(400)
          .json({ success: false, message: "admin/email is already exist" });
      }
      const adminAdded = new AdminEmpModel({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        fullName: `${req.body.first_name} ${req.body.last_name}`,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
        avatar: req.file.path,
        //role: req.body.role,
        //created_by: req.body.created_by,
        created_log_date: new Date().toISOString().slice(0, 10),
      }).save(function (err, data) {
        if (err) {
          return res.status(400).json({ success: false, message: err });
        }
        return res
          .status(200)
          .json({ success: true, message: "successfully inserted data" });
      });
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};

//login to admin
exports.userLogin = async function (req, res) {
 try {
    const email = req.body.email;
    const password = req.body.password;
    const adminFound = await AdminEmpModel.findOne(
      { email: email },
      {
        id: 1,
        first_name:1,
        last_name:1,
        fullName: 1,
        avatar: 1,
        email: 1,
        password:1,
        role: 1,
      }
    );
    if (adminFound) {
      const isMatch = await bcrypt.compare(password, adminFound.password);
      if (isMatch) {
        const token = jwt.sign(
          { _id: adminFound._id },
          "process.env.SJ_VERIFY_TOKEN",
          { expiresIn: "24h" }
        );
        if (token) {
          const adminDetails = {
            id: adminFound._id,
            fullName: adminFound.fullName,
            username: adminFound.first_name+adminFound.last_name,
            avatar: adminFound.avatar,
            email: adminFound.email,
            role: adminFound.role,
            ability: [
              {
                action: "manage",
                subject: "all",
              },
            ],
          };
          return res.status(200).json({
            success: true,
            status: "You are now logged in. ",
            users: adminDetails,
            token: token,
          });
        } else {
          res.status(400).send({
            success: false,
            message: "error in token generation or sending token.",
          });
        }
      } else {
        res
          .status(400)
          .send({
            success: false,
            message: "You have entered the incorrect password. ",
          });
      }
    } else {
      res
        .status(400)
        .send({
          success: false,
          message: "You have entered the incorrect email address.",
        });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};

//get admin profile
exports.getUser = async (req, res) => {
  try {
    const adminFound = await AdminEmpModel.findById({ _id: req.admin });
    if (adminFound) {
      res.status(200).json({ success: true, message: adminFound });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};

//update admin  profile
exports.updateUser = async function (req, res) {
  try {
    let adminFound = await AdminEmpModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
        role: req.body.role,
        avatar: req.file.path,
        modified_by: req.body.modified_by,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (adminFound) {
      res
        .status(200)
        .json({ success: true, message: "profile updated successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "unable to update profile" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};

//delete admin-employee profile
exports.deleteUser= async (req, res) => {
  try {
    const adminDeleted = await AdminEmpModel.findByIdAndDelete({
      _id: req.body.id,
    });
    if (adminDeleted) {
      res.status(200).json({ success: true, message: "successfully deleted" });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};

// change - update password
exports.userChangePassword = async (req, res, next) => {
  try {
    // console.log(req.body);
    const password = req.body.password;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;

    console.log(req.userId);
    if (password == null || password == undefined || password == "") {
      return res
        .status(400)
        .json({
          success: true,
          message: "Please enter your current password.",
        });
    }
    const userPass = await AdminEmpModel.findOne(
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
        res
          .status(200)
          .json({
            success: true,
            message: "Password has been successfully updated. ",
          });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Password is incompatible." });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid password" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};
