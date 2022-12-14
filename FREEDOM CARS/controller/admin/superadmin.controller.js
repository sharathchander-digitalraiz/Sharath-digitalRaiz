const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const superadminModel = require("../../model/superadminAuth");

// add/signup super admin
exports.superAdminSignup = function (req, res) {
  // try {
    superadminModel
      .findOne({ email: req.body.email })
      .exec(function (er, user) {
        if (user) {
          return res.status(400).json({ message: "User already exist" });
        } else {
          let userpass = req.body.password;
          const bcryptPass = bcrypt.hashSync(userpass, 10);

          const userObj = new superadminModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcryptPass,
            phone: req.body.phone,
            role: "superadmin",
            city: req.body.city,
            address: req.body.address,
            postalCode: req.body.postalCode,
          });

          userObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "User could not be added", Error: eror });
            }
            if (data) {
              res.status(200).json({ message: "User added successfully" });
            }
          });
        }
      });
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// super admin Login / Sign in
exports.superAdminSignin = async function (req, res) {
  try {
    const user = await superadminModel.findOne(
      { email: req.body.email },
      { _id: 1, email: 1, phone: 1, role: 1, password: 1, status: 1 }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);

      console.log(pass);
      console.log(user);
      if (pass && user.role == "superadmin") {
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
        res.status(200).json({ token: token, user: user });
      } else {
        res.status(400).json({
          status: 400,
          message: "Invalid user or data"
        });
      }
    } else {
      res.status(400).json({ status: 404, message: "No User Found" });
    }
  } catch (err) {
    // console.log(err);
    res
      .status(400)
      .json({ error: err, status: 500, message: "Internal server Error" });
  }
};
