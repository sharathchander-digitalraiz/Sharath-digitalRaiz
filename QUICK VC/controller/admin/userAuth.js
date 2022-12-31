// importing the required libraries
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// configure dotenv
dotenv.config();

// importing the required model
const User = require("../../model/userAuth");
const otpModel = require("../../model/otp");

// admin registeration/signup function
exports.adminSignup = function (req, res) {
  User.findOne({ email: req.body.email }).exec(function (err, user) {
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    } else {
      const {
        firstName,
        lastName,
        email,
        password,
        countrtyCode,
        contactNumber
      } = req.body;
      const addUser = new User({
        firstName,
        lastName,
        email,
        password,
        countrtyCode,
        contactNumber,
        role: "user"
      });

      if (password == req.body.confirmPass) {
        addUser.save(function (err, data) {
          if (err) {
            console.log(err);
            if (err.keyPattern["contactNumber"]) {
              console.log(err.keyPattern["contactNumber"]);
              return res.status(400).json({
                message: "contactNumber already exists. Try with different"
              });
            }
            return res
              .status(400)
              .json({ message: "something went wrong", error: err });
          }
          if (data) {
            return res
              .status(201)
              .json({ message: "User created successfully!" });
          }
        });
      } else {
        res.status(400).json({ message: "Passwords does not match!" });
      }
    }
  });
};

// user login/signin function
exports.adminSignin = function (req, res) {
  let searchInputs = {};
  if (req.body.email) {
    searchInputs.email = req.body.email;
  }
  if (req.body.contactNumber) {
    searchInputs.contactNumber = req.body.contactNumber;
  }
  User.findOne(searchInputs).exec(function (err, user) {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (user) {
      if (user.email == req.body.email) {
        if (user.authenticate(req.body.password) && user.role != "admin") {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET_PASSWORD,
            { expiresIn: "24h" }
          );
          const { _id, username, email, role, contactNumber } = user;
          res.status(200).json({
            message: "Successfully logged in",
            token,
            user: {
              _id,
              username,
              email,
              role,
              contactNumber
            }
          });
        } else {
          res.status(400).json({ message: "Invalid Password" });
        }
      } else {
        return res.status(400).json({ message: "Invalid email address" });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong..!" });
    }
  });
};

// admin change password function
exports.adminPasswordChange = async function (req, res) {
  try {
    const { currentPassword, newPlainPassword, confirmPassword } = req.body;

    console.log(req.userId);

    const userPass = await User.findOne(
      { _id: req.userId },
      { hash_password: 1 }
    );

    let currentPassVal = bcrypt.compareSync(
      currentPassword,
      userPass.hash_password
    );

    if (currentPassVal == true) {
      if (newPlainPassword == confirmPassword) {
        const bcruptedPassword = bcrypt.hashSync(confirmPassword, 10);

        await User.updateOne(
          { _id: req.userId },
          { $set: { hash_password: bcruptedPassword } },
          { new: true }
        );
        res.status(200).json({ message: "Password changed" });
      } else {
        res.status(400).json({ message: "Password does not match" });
      }
    } else {
      res
        .status(400)
        .send({ message: "Invalid Password, Please enter correct password" });
    }
  } catch {
    res.status(400).json({ message: "Invalid Request" });
  }
};
