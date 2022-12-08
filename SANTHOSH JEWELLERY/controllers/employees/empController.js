const Schema = require("../../models/adminEmp/adminEmpSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//adding Employee(emp)
exports.addEmp = function (req, res) {
  try {
    Schema.findOne({ email: req.body.email }).exec((err, emp) => {
      if (emp) {
        return res
          .status(400)
          .json({ success: false, message: "employee/email is already exist" });
      }
      const empAdded = new Schema({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10),
        designation: req.body.designation,
        department: req.body.department,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        address: req.body.address,
        avatar: req.file.path,
        created_by: req.body.created_by,
        created_log_date: new Date().toISOString().slice(0, 10),
      }).save(function (err, data) {
        if (err) {
          return res.status(400).json({ success: false, message: err });
        }
        return res
          .status(200)
          .json({ success: true, message: "successfully inserted" });
      });
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//login to admin
exports.employeeLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const empFound = await Schema.findOne({ email: email });
    if (empFound) {
      const isMatch = await bcrypt.compare(password, empFound.password);
      if (isMatch) {
        const token = jwt.sign(
          { _id: empFound._id },
          "process.env.SJ_VERIFY_TOKEN",
          { expiresIn: "24h" }
        );
        if (token) {
          const empDetails = {
            id: empFound._id,
            first_name: empFound.first_name,
            last_name: empFound.last_name,
            email: empFound.email,
            phone: empFound.phone,
            designation: empFound.designation,
            department: empFound.department,
            city: empFound.city,
            state: empFound.state,
            country: empFound.country,
            address: empFound.address,
            avatar: empFound.avatar,
          };
          return res
            .status(200)
            .json({ success: true, empDetails, token: token });
        } else {
          res.status(400).send({
            success: false,
            message: "error in token generation or sending token",
          });
        }
      } else {
        res
          .status(400)
          .send({ success: false, message: "you entered wrong password" });
      }
    } else {
      res
        .status(400)
        .send({ success: false, message: "you entered wrong username" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get admin profile
exports.getEmployee = async (req, res) => {
  try {
    const empFound = await Schema.findById({ _id: req.admin });
    if (empFound) {
      res.status(200).json({ success: true, message: empFound });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//update admin  profile
exports.updateEmployee = async function (req, res) {
  try {
  let empFound = await Schema.findOneAndUpdate(
    { _id: req.admin },
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      designation: req.body.designation,
      department: req.body.department,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      address: req.body.address,
      avatar: req.file.path,
      modified_by: req.body.modified_by,
      modified_log_date: new Date().toISOString().slice(0, 10),
    }
  );
  if (empFound) {
    res
      .status(200)
      .json({ success: true, message: "profile updated successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "unable to update profile" });
  }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
