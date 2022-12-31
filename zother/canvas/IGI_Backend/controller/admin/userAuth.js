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
exports.userSignup = function (req, res) {
  User.findOne({ email: req.body.email }).exec(function (err, user) {
    if (user) {
      return res.status(400).json({ message: "Admin already exist" });
    } else {
      const {
        // firstName,
        // lastName,
        username,
        email,
        password,
        contactNumber,
        status,
      } = req.body;
      const addUser = new User({
        // firstName,
        // lastName,
        username,
        email,
        password,
        contactNumber,
        role: "admin",
        status,
      });
      addUser.save(function (err, data) {
        if (err) {
          console.log(err);
          if (err.keyPattern["username"]) {
            console.log(err.keyPattern["username"]);
            return res.status(400).json({
              message: "AdminName already exists. Try with different name",
            });
          }
          if (err.keyPattern["contactNumber"]) {
            console.log(err.keyPattern["contactNumber"]);
            return res.status(400).json({
              message: "contactNumber already exists. Try with different",
            });
          }
          return res
            .status(400)
            .json({ message: "something went wrong", error: err });
        }
        if (data) {
          return res
            .status(201)
            .json({ message: "Admin created successfully!" });
        }
      });
    }
  });
};

// admin login/signin function
exports.userSignin = function (req, res) {
  User.findOne({ email: req.body.email }).exec(function (err, user) {
    if (err) {
      // throw err
      return res.status(400).json({ error: err });
    }

    if (user) {
      if (user.authenticate(req.body.password) && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET_PASSWORD,
          { expiresIn: "24h" }
        );
        const { _id, email, role } = user;
        res.status(200).json({
          message: "Successfully logged in",
          token,
          user: {
            _id,
            email,
            role,
          },
        });
        // console.log(token);
      } else {
        res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong..!" });
    }
  });
};

// admin change password function
exports.userPasswordChange = async function (req, res) {
  try {
    const { currentPassword, newPlainPassword, confirmPassword } = req.body;

    if (
      currentPassword == null ||
      currentPassword == undefined ||
      currentPassword == ""
    ) {
      res.status(400).json({ message: "Please enter current password" });
    }

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
        res.status(400).json({ message: "Password not match" });
      }
    }
  } catch {
    res.status(400).json({ message: "Invalid Request" });
  }
};

/***************Forgot password functionalities ******************/
exports.generateOtp = function (req, res) {
  try {
    User.findOne({ email: req.body.email }).exec(function (err, user) {
      if (user) {
        let num = "1234567890";
        let otp = "";
        let oneTimePassword;
        let senderEmail = req.body.email;

        for (let i = 0; i < 6; i++) {
          otp = otp + num[Math.floor(Math.random() * 10)];
        }

        oneTimePassword = otp;

        const otpObj = new otpModel({
          emailOtp: oneTimePassword,
          emailId: senderEmail,
        });

        otpObj.save(function (eror, data) {
          if (eror) {
            res.status(400).json({ message: "OTP could not be generated" });
          }
          if (data) {
            let transporter = nodemailer.createTransport({
              service: "hotmail",
              auth: {
                user: `${process.env.EMAILADDRESS}`,
                pass: `${process.env.EMAILPASSWORD}`,
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

            let mailOpetions = {
              from: "no-reply.digitalraiz@hotmail.com",
              to: `${senderEmail}`,
              subject: "Forgot password OTP",
              html: `<p> OTP for changing the password is\:
            <strong style=" color : DarkBlue; font-size: 20px"> ${oneTimePassword} </strong> </p> <hr> <br> <p> <i style="font-size: 15px"> The OTP is valid for 10 min! </i> </p> `,
            };

            transporter.sendMail(mailOpetions, function (err, success) {
              if (err) {
                console.log(err);
              }
              if (success) {
                console.log("Email sent successfully");
              }
            });
            res
              .status(200)
              .json({ message: "OTP sent successfully to specified email..!" });
          }
        });
      } else {
        res
          .status(200)
          .json({ message: "User is not registered with this email" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// compare Otp
exports.compareOtp = async function (req, res) {
  try {
    const compareNewOtp = await otpModel.findOne(
      { emailOtp: req.body.emailOtp },
      { _id: 0, emailOtp: 1 }
    );
    if (compareNewOtp.emailOtp == req.body.emailOtp) {
      res.status(200).json({ message: "OTP verified!" });
    }
  } catch (err) {
    res.status(400).json({ message: "OTP does not match..!" });
  }
};

// forgot password - reset password
exports.resetPasswordController = async function (req, res, next) {
  try {
    User.findOne({ email: req.body.email }).exec(async function (e, mail) {
      if (mail) {
        const { newPlainPassword, confirmPassword } = req.body;

        if (newPlainPassword == confirmPassword) {
          const bcruptedPassword = bcrypt.hashSync(confirmPassword, 10);

          await User.updateOne(
            { email: req.body.email },
            { $set: { hash_password: bcruptedPassword } },
            { new: true }
          );
          res.status(200).json({ message: "Password reset successfully" });
        } else {
          res.status(400).json({ message: "Passwords does not match" });
        }
      } else {
        res.status(400).json({ message: "This email is not registered!" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid Request" });
  }
};
