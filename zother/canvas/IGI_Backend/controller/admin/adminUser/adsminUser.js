// importing libraries
const bcrypt = require("bcrypt");

const adminUserModel = require("../../../model/adminUsers");

// add admin users
exports.addAdminUser = function (req, res) {
  try {
    adminUserModel
      .findOne({ email: req.body.email })
      .exec(function (error, email) {
        if (email) {
          res.status(400).json({ message: "User already exist!" });
        } else {
          const adminUserObj = new adminUserModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: "admin",
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            createdBy: req.userId,
            status: req.body.status,
          });

          adminUserObj.save(function (er, data) {
            if (er) {
              res.status(400).json({ message: "User Could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "User added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get admin user
exports.getAdminUser = async function (req, res) {
  try {
    const userResult = await adminUserModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", userResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all admin users
exports.getAllAdminUsers = async function (req, res) {
  try {
    const usersResult = await adminUserModel.find().sort({ createdAt: -1 });

    res.status(200).json({ message: "Success", usersResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update admin user
exports.editAdminUser = async function (req, res) {
  try {
    // let userPassword = req.body.password;
    // let beCruptedPassword = bcrypt.hashSync(userPassword, 10);

    const changeUser = await adminUserModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        username: req.body.username,
        email: req.body.email,
        hash_password: "beCruptedPassword",
        contactNumber: req.body.contactNumber,
        modifiedBy: req.userId,
        status: req.body.status,
      }
    );

    if (changeUser) {
      res.status(200).json({ message: "User details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove admin user
exports.removeAdminUser = async function (req, res) {
  try {
    const removeResult = await adminUserModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (removeResult) {
      res.status(200).json({ message: "User removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
