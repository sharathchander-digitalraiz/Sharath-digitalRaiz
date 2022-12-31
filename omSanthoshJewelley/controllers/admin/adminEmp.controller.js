// getting all the libraries
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// import models
const AdminEmpes = require("../../models/adminEmps");
const Otps = require("../../models/otps");
const Departments = require("../../models/departments");

// admin/Emp registerations
exports.adminEmpRegister = function (req, res) {
  try {
    AdminEmpes.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    }).exec(async function (err, user) {
      if (user) {
        return res
          .status(400)
          .json({ sucess: false, message: "The user already exists!" });
      } else {
        const dept = await Departments.findOne(
          { _id: req.body.departmentId },
          { departmentName: 1 }
        );
        const admin = await AdminEmpes.findOne(
          { _id: req.userId },
          { _id: 1, name: 1 }
        );
        const bcryptedPassword = bcrypt.hashSync(req.body.password, 10);
        let logDate = new Date().toISOString().slice(0, 10);
        const adminEmpObj = new AdminEmpes({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          fullName: `${req.body.firstName} ${req.body.lastName}`,
          email: req.body.email,
          phone: req.body.phone,
          password: bcryptedPassword,
          designation: req.body.designation,
          departmentId: req.body.departmentId,
          departmentName: dept.departmentName,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          address: req.body.address,
          adminId: admin._id,
          createdBy: admin.name,
          logCreatedDate: logDate,
          logModifiedDate: logDate,
        }).save(function (error, userData) {
          if (error) {
            return res.status(400).json({
              sucess: false,
              message: "Bad request. User data could not be saved.",
              Error: error,
            });
          }
          if (userData) {
            res
              .status(200)
              .json({ sucess: true, message: "User successfully added" });
          }
        });
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ sucess: false, message: "Something went wrong!", Error: err });
  }
};

// admin/Emp Login/Sign in
exports.adminEmpLogin = async function (req, res) {
  try {
    const user = await AdminEmpes.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        departmentName: 1,
        password: 1,
        status: 1,
      }
    );
    if (user) {
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);
      if (pass && user.departmentName) {
        let token = jwt.sign(
          {
            userId: user._id,
            password: user.password,
            departmentName: user.departmentName,
          },
          process.env.ADMIN_SECRET_KEY,
          { expiresIn: process.env.ADMIN_EXPIRY_DATE }
        );
        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          departmentName: user.departmentName,
        };
        res.status(200).json({
          success: true,
          message: "You have successfully logged in.",
          token: token,
          user: userData,
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Please provide a valid password.",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Please provide a valid email address or phone number.",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Something went wrong!",
      Error: err,
    });
  }
};

// get admin profile
exports.getAdminEmpProfile = async function (req, res) {
  try {
    const profileResult = await AdminEmpes.findOne({ _id: req.userId });
    if (profileResult) {
      res.status(200).json({
        success: true,
        message: "fetched user data successfully.",
        profileResult,
      });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Somthing went wrong!" });
  }
};

// update profile
exports.adminEmpEditProfile = async function (req, res) {
  try {
    let logDate = new Date().toISOString().slice(0, 10);
    const dept = await Departments.findOne(
      { _id: req.body.departmentId },
      { departmentName: 1 }
    );
    const updateProfile = await AdminEmpes.findByIdAndUpdate(
      { _id: req.userId },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          fullName: `${req.body.firstName} ${req.body.lastName}`,
          email: req.body.email,
          phone: req.body.phone,
          profilePic: req.file ? req.file.path : console.log("No Img"),
          designation: req.body.designation,
          departmentId: req.body.departmentId,
          departmentName: dept.departmentName,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          address: req.body.address,
          logModifiedDate: logDate,
        },
      },
      { new: true }
    );
    if (updateProfile) {
      res.status(200).json({
        success: true,
        message: "Your profile was successfully updated.",
      });
    } else {
      res.status(400).json({ success: false, message: "Bad request." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong!" });
  }
};

// change - update password
exports.adminEmpUpdatePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;
    if (password == null || password == undefined || password == "") {
      return res
        .status(400)
        .json({ success: false, message: "Input is invalid" });
    }
    const userPass = await AdminEmpes.findOne(
      { _id: req.userId },
      { password: 1 }
    );
    let Password = bcrypt.compareSync(password, userPass.password);
    if (Password == true) {
      if (newpassword == confirmpassword) {
        const bcryptedPassword = bcrypt.hashSync(confirmpassword, 10);
        await adminAuthModel.updateOne(
          { _id: req.userId },
          { $set: { password: bcryptedPassword } },
          { new: true }
        );
        res
          .status(200)
          .json({ success: true, message: "Your password has been successfully updated." });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Passwords are incompatible" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Please enter a valid password." });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", error: err });
  }
};

// update profile image
exports.editProfileImage = async function (req, res) {
  try {
    const updateImage = await AdminEmpes.updateOne(
      { _id: req.params.id },
      {
        $set: {
          profilePic: req.file.path,
        },
      },
      { new: true }
    );
    if (updateImage) {
      res
        .status(200)
        .json({
          success: true,
          message: "Successfully updated profile picture.",
        });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Something went wrong!" });
  }
};

/***************Forgot password functionalities ******************/
exports.generateOtp = function (req, res) {
  try {
    AdminEmpes
      .findOne({ email: req.body.email },{})
      .exec(function (err, user) {
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
              return res
                .status(400)
                .json({ message: "OTP could not be generated due to a bad request." });
            }
            if (data) {
              // const transporter = nodemailer.createTransport({ // forgot password passed attempt for gmail
              //   service: "gmail",
              //   host: "smtp.gmail.com",
              //   port: "587",
              //   auth: {
              //     user: "syed.umaismgm@gmail.com",
              //     pass: "broakwltzgqydmdr"
              //   },
              //   secureConnection: "false",
              //   tls: {
              //     ciphers: "SSLv3",
              //     rejectUnauthorized: false
              //   }
              // });

              const transporter = nodemailer.createTransport({
                service: "email",
                host: "mail.digitalraiz.co.in",
                port: "587",
                auth: {
                  user: "no-reply@digitalraiz.co.in",
                  pass: "6RwZAp&0s",
                },
                secureConnection: "false",
                tls: {
                  ciphers: "SSLv3",
                  rejectUnauthorized: false,
                },
              });

              console.log(senderEmail);
              let mailOpetions = {
                from: "no-reply@digitalraiz.co.in",
                to: `${senderEmail}`,
                subject: "One Time Password(OTP) for forgotten password recovery",
                html: `<h1>One Time Password (OTP) for forgotten password recovery on Om Santhosh Jewellers Portal is</h1>
                <p style="font-size: 20px; font-family:initial;">Hi ${AdminEmpes.fullName}!</p>
                <p style="font-size: 20px; font-family:initial;">You seem to have forgotten your Om Santhosh Jewellers Portal password! No worries! We've got your back.</p>
                <span style="font-size: 20px; font-family:initial;">One Time Password (OTP) for forgotten password recovery on Om Santhosh Jewellers Portal is\:
                <strong style=" color : DarkBlue; font-size: 20px"> ${oneTimePassword} </strong> </p> <hr> <br/> <span style="font-size: 20px; font-family:initial;"> Please note, this OTP is valid for 10 minutes. Please do not share this One Time password with anyone.</i> </span></br> 
                <span style="font-size: 20px; font-family:initial;">If you need any further assistance, contact us at <strong style=" color : Red; font-size: 20px"><a href="info@omsanthoshjewellers.com">info@omsanthoshjewellers.com</a></strong></p> <br/>
                <p style="font-size: 20px; font-family:initial;">Warm Regards,</span><br/>
                <span style="color : Red; font-size: 20px; font-family:initial;" >Om Santhosh Jewellers</span><br/>`
                
              };//<i style="font-size: 15px">make italic style with light text colour</i>
              transporter.sendMail(mailOpetions, function (err, success) {
                if (err) {
                  console.log(err);
                }
                if (success) {
                  console.log("The email was successfully sent.");
                }
              });
              res.status(200).json({
                message: "OTP was successfully sent to your registered email address.",
              });
            }
          });
        } else {
          return res
            .status(400)
            .json({success:false, message: "The user has not registered this email address." });
        }
      });
  } catch (err) {
    res.status(400).json({success:false, message: "Something went wrong!" });
  }
};

// comapre OTP
exports.compareOtp = function (req, res) {
  try {
    const otpResult = Otps
      .findOne({ emailOtp: req.body.emailOtp })
      .exec(function (er, otp) {
        if (otp) {
          res
            .status(200)
            .json({ success: true, message: "OTP was verified successfully." });
        }if(err) {
          return res
            .status(400)
            .json({ success: false, message: "Please provide a valid OTP.",Error:err });
        }
      });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong!", Error: err });
  }
};

// reset password
exports.resetPassword = function (req, res) {
  try {
    const showEmail = Otps
      .findOne({ emailOtp: req.body.emailOtp }, { emailId: 1, emailOtp: 1 })
      .exec(async function (er, otp) {
        if (otp) {
          const { newpassword, confirmpassword } = req.body;

          if (newpassword == confirmpassword) {
            let bcruptedPassword = bcrypt.hashSync(confirmpassword, 10);

            const showUser = await AdminEmpes.updateOne(
              { email: otp.emailId },
              {
                $set: {
                  password: bcruptedPassword,
                },
              },
              { new: true }
            );

            const transporter = nodemailer.createTransport({
              service: "email",
              host: "mail.digitalraiz.co.in",
              port: "587",
              auth: {
                user: "no-reply@digitalraiz.co.in",
                pass: "6RwZAp&0s",
              },
              secureConnection: "false",
              tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
              },
            });

            // console.log(senderEmail);
            let mailOpetions = {
              from: "no-reply@digitalraiz.co.in",
              to: `${otp.emailId}`,
              subject: "Reset Password",
              html: `<p>  <i style=style=" color : black; "font-size: 15px"> You have successfully reset your password. </i> <br/> <br/> <br/> <strong style=" color : Black; font-size: 15px"><p> Note: If this action has not been taken by you, then please contact Digital Raiz Creative Solutions, Hyderabad.</p> </strong>`,
            };

            transporter.sendMail(mailOpetions, function (err, success) {
              if (err) {
                console.log(err);
              }
              if (success) {
                console.log("The email was successfully sent.");
              }
            });

            res.status(200).json({
              message:
                "Email successfully sent; please login using your new password.",
            });
          }
        } else {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong!" });
  }
};


// `<p style="font-size: 20px; font-family:initial;">Hi ${AdminEmpes.fullName}!</p>
//                 <p style="font-size: 20px; font-family:initial;">You seem to have forgotten your Om Santhosh Jewellers Portal password! No worries! We've got your back.</p>
//                 <p style="font-size: 20px; font-family:initial;">One Time Password (OTP) for forgotten password recovery on Om Santhosh Jewellers Portal is\:
//             <strong style=" color : DarkBlue; font-size: 20px"> ${oneTimePassword} </strong> </p> <hr> <br/> <p style="font-size: 20px; font-family:initial;"> Please note, this OTP is valid for 10 minutes. Please do not share this One Time password with anyone.</i> </p> 
//             <p style="font-size: 20px; font-family:initial;">If you need any further assistance, contact us at <strong style=" color : Red; font-size: 20px"><a href="info@omsanthoshjewellers.com">info@omsanthoshjewellers.com</a></strong></p>
//             <span style="font-size: 20px; font-family:initial;">Warm Regards,</span><br/>
//             <span style="color : Red; font-size: 20px; font-family:initial;" >Om Santhosh Jewellers</span><br/>`