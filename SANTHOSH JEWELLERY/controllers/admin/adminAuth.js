const Schema = require("../../models/adminEmp/adminEmpSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//adding admin
exports.addAdmin = function (req, res) {
  try {
  Schema.findOne({ email: req.body.email }).exec((err, admin) => {
      if (admin) {
        return res
          .status(400)
          .json({ success: false, message: "admin/email is already exist" });
      }
      const adminAdded = new Schema({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
        avatar: req.file.path,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 10),
        created_by: req.body.created_by,
        role: req.body.role,
        created_log_date: new Date().toISOString().slice(0, 10),
      }).save(function (err, data) {
        if (err) {
          return res.status(400).json({ success: false, message: err });
        }
        return res
          .status(200)
          .json({ success: true, message: "successfully inserted" });
      });
    })
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//login to admin
exports.adminLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminFound = await Schema.findOne({ email: email });
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
            first_name: adminFound.first_name,
            last_name: adminFound.last_name,
            email: adminFound.email,
            phone: adminFound.phone,
            address: adminFound.address,
            state: adminFound.state,
            zipcode: adminFound.zipcode,
            country: adminFound.country,
            avatar: adminFound.avatar,
            role: adminFound.role,
          };
          return res
            .status(200)
            .json({ success: true, token: token, status:"your successfully logged in" });
        } else {
          res.status(400).send({
            success: false,
            message: "error in token generation or sending token",
          });
        }
      } else {
        res.status(400).send({ success: false, message: "you entered wrong password" });
      }
    } else {
      res.status(400).send({ success: false, message: "you entered wrong email" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get admin profile
exports.getAdmin = async (req, res) => {
  try {
    const adminFound = await Schema.findById({ _id: req.admin });
    if (adminFound) {
      res.status(200).json({ success: true, message: adminFound });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//update admin  profile
exports.updateAdmin = async function (req, res) {
  try {
    let adminFound = await Schema.findOneAndUpdate(
      { _id: req.admin },
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
      res.status(200).json({ success: true, message: "profile updated successfully" });
    } else {
      res.status(400).json({ success: false, message: "unable to update profile" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete admin-employee profile
exports.deleteAdminEmp = async (req, res) => {
  try {
    const adminDeleted = await Schema.findByIdAndDelete({ _id: req.params.id });
    if (adminDeleted) {
      res.status(200).json({ success: true, message:"successfully deleted" });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};



