// import libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const customerModel = require("../../model/customer");
const adminAuthModel = require("../../model/adminAuth");
const employeeModel = require("../../model/employee");
const branchModel = require("../../model/branch");
const documentModel = require("../../model/document");

// add - signup customer
exports.customerAppSignup = function (req, res) {
  // try {
  //   customerModel
  //     .findOne({
  //       $or: [{ email: req.body.email }, { phone: req.body.phone }],
  //     })
  //     .exec(async function (er, cust) {
  //       if (cust) {
  //         return res.status(400).json({ message: "Customer already exist!" });
  //       } else {
  //         const adminn = await adminAuthModel.findOne(
  //           { _id: req.body.adminId },
  //           { name: 1 }
  //         );

  //         const branchh = await branchModel.findOne(
  //           { _id: req.body.branchId },
  //           { branchName: 1 }
  //         );

  const pass = bcrypt.hashSync(req.body.password, 10);

  let logDate = new Date().toISOString();

  const custObj = new customerModel({
    customerName: req.body.customerName,
    email: req.body.email,
    password: pass,
    phone: req.body.phone,
    alternate_phone: req.body.alternate_phone,
    profilePic: req.file.path,
    //appFcmToken: req.body.appFcmToken,
    // address: req.body.address,
    logDateCreated: logDate,
  });

  custObj.save(function (eror, datta) {
    if (eror) {
      return res
        .status(400)
        .json({ message: "Customer details could not be added", eror });
    }
    res.status(200).json({ message: "Customer added" });
  });
  //           if (datta) {
  //             const documentObj = new documentModel({
  //               customerId: datta._id,
  //               customerName: datta.customerName,
  //             });

  //             documentObj.save();
  //             res
  //               .status(200)
  //               .json({ message: "Customer details added successfully" });
  //           }
  //         });
  //       }
  //     });
  // } catch (err) {
  //   res.status(400).json({ message: "Invalid data..!" });
  // }
};

// customer signin
exports.customerAppSignin = async function (req, res) {
  try {
    const user = await customerModel.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      {
        _id: 1,
        customerName: 1,
        email: 1,
        phone: 1,
        password: 1,
        appFcmToken: 1,
        isBlocked: 1,
        status:1
      }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);
      
      console.log(pass);
      console.log(user);
      if (pass) {
        // generate JWT Token
        let token = jwt.sign(
          {
            userId: user._id,
            password: user.password,
            role: user.role,
          },
          process.env.ADMIN_SECRET_KEY,
          { expiresIn: process.env.ADMIN_EXPIRY_DATE }
        );

        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "Customer",
        };
        let fcm = user.appFcmToken;
        res
          .status(200)
          .json({ token: token, appFcmToken: fcm, user: userData });
      } else {
        res.status(401).json({
          status: 401,
          message: "Invalid user or data",
        });
      }
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }
  } catch (err) {
    // console.log(err);
    res
      .status(401)
      .json({ error: err, status: 401, message: "Invalid email or password" });
  }
};

//change password controller
exports.changePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const adminData = await customerModel.findOne({ _id: req.userId });
    const passwordMatched = await bcrypt.compare(password, adminData.password);
    if (passwordMatched) {
      const newpassword = req.body.newpassword;
      const confirmpassword = req.body.confirmpassword;
      if (newpassword === confirmpassword) {
        const adminFound = await customerModel.findOne({ _id: req.userId });
        if (adminFound) {
          const newPassword = bcrypt.hashSync(confirmpassword, 10);
          await customerModel.findOneAndUpdate(
            { _id: req.userId },
            { $set: { password: newPassword } }
          );
          res.status(200).json({
            success: true,
            messsage: "Your password has been successfully updated.",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          messsage:
            "The new-password does not correspond to the confirm-password. ",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        messsage: "Password is wrong.",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, messsage: err });
  }
};

//get notification_bell status controller
exports.getNotification = async (req, res) => {
  try {
    const notification = await customerModel.findById(
      { _id: req.userId },
      { notification_bell: 1 }
    );
    if (notification) {
      res
        .status(200)
        .json({ success: true, messsage: "successfull", notification });
    } else {
      res.status(400).json({ success: false, messsage: "Bad request" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, messsage: "Something went wrong", Error: err });
  }
};

//update notification_bell status controller
exports.updateNotification = async (req, res) => {
  try {
    const notification = await customerModel.findByIdAndUpdate(
      { _id: req.userId },
      [{ $set: { notification_bell: { $not: "$notification_bell" } } }]
      //[{ $set: { notification_bell: { $eq: [false, "$notification_bell"] } } }]
    );
    if (notification) {
      res
        .status(200)
        .json({ success: true, messsage: "Updatd Successfull", notification });
    } else {
      res.status(400).json({ success: false, messsage: "Bad request" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, messsage: "Something went wrong", Error: err });
  }
};

// // get customer details
// exports.getCustomerDetails = async function (req, res) {
//   try {
//     const custResult = await customerModel.findById({ _id: req.body._id });

//     res.status(200).json({ message: "Success", custResult });
//   } catch (err) {
//     res.status(400).json({ message: "Bad request" });
//   }
// };

// // get all customers list - for admin
// exports.getAllcustomers = async function (req, res) {
//   try {
//     const custsResult = await customerModel.find().sort({ logDateCreated: -1 });

//     res.status(200).json({ message: "Success", custsResult });
//   } catch (err) {
//     res.status(400).json({ message: "Bad request" });
//   }
// };

// // get all active customers list
// exports.getAllActiveCustomers = async function (req, res) {
//   try {
//     const custActiveResult = await customerModel.find({ isBlocked: false });

//     res.status(200).json({ message: "Success", custActiveResult });
//   } catch (err) {
//     res.status(400).json({ message: "Bad request" });
//   }
// };

// // get all verified customers list
// exports.getAllVerifiedCustomers = async function (req, res) {
//   try {
//     const custVerifiedResult = await customerModel.find({ status: true });

//     res.status(200).json({ message: "Success", custVerifiedResult });
//   } catch (err) {
//     res.status(400).json({ message: "Bad request" });
//   }
// };

// update customer details
exports.editCustomerDetails = async function (req, res) {
  try {
    const changeCust = await customerModel.updateOne(
      { _id: req.userId },
      {
        $set: {
          customerName: req.body.customerName,
          email: req.body.email,
          phone: req.body.phone,
          alternate_phone: req.body.alternate_phone,
          profilePic: req.file.path,
          logDateModified: new Date().toISOString(),
        },
      },
      { new: true }
    );
    if (changeCust) {
      res
        .status(200)
        .json({
          success: true,
          message: "Customer details updated successfully",
        });
    }
    res.status(400).json({ success: false, message: "Bad request" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

//post request for wallet amount
exports.withdrawalWalletAmount = async (req, res) => {
  try {
    const amount = await customerModel.updateOne(
      { _id: req.userId },
      {
        wallet: req.body.wallet,
      },
      {new:true}
    );
    if (amount) {
      res
        .status(200)
        .json({
          success: true,
          message: "Customer details updated successfully",
        });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

const otpModel = require("../../model/otp");
const nodemailer =require("nodemailer");
//forgot password for customer api
exports.generateOtp = function (req, res) {
  // try {
    customerModel.findOne({ email: req.body.email }).exec(function (err, user) {
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
        emailId: senderEmail
      });

      otpObj.save(function (eror, data) {
        if (eror) {
          return res
            .status(400)
            .json({ message: "OTP could not be generated" });
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
            service: "gmail",
           // host: "mail.digitalraiz.co.in",
            host: "smtp.gmail.com" ,
            //port: "587",
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {
              user: "sharathchanderg3@gmail.com",
             // user: "no-reply@digitalraiz.co.in",
              pass: "drodhxsooferaydf",
              //pass: "6RwZAp&0s"
            },
          //   secureConnection: "false",
          //   tls: {
          //     ciphers: "SSLv3",
          //     rejectUnauthorized: false
          //   }
          });

          console.log(senderEmail);
          let mailOpetions = { 
            from: "sharathchanderg3@gmail.com",
            to: `${senderEmail}`,
            subject: "Forgot password OTP",
            html: `<p> The OTP for changing the password is\:
            <strong style=" color : DarkBlue; font-size: 20px"> ${oneTimePassword} </strong> 
            </p> <hr> <br/> <p> <i style="font-size: 15px"> The OTP is valid for 10 minutes! </i> </p> `
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
            .json({ message: "OTP was sent successfully to the specified email." });
        }
      });
    } else {
      return res
        .status(400)
        .json({ message: "The user is not registered with this email." });
    }
  });
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// comapre OTP
exports.compareOtp = function (req, res) {
  try {
    const otpResult = otpModel
      .findOne({ emailOtp: req.body.emailOtp })
      .exec(function (er, otp) {
        if (otp) {
          res.status(200).json({ message: "OTP was verified successfully." });
        } else {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Invalid OTP", Error: err });
  }
};

// reset password
exports.resetPassword = function (req, res) {
  try {
    const showEmail = otpModel
      .findOne({ emailOtp: req.body.emailOtp }, { emailId: 1, emailOtp: 1 })
      .exec(async function (er, otp) {
        if (otp) {
          const { newpassword, confirmpassword } = req.body;

          if (newpassword == confirmpassword) {
            let bcruptedPassword = bcrypt.hashSync(confirmpassword, 10);

            const showUser = await customerModel.updateOne(
              { email: otp.emailId },
              {
                $set: {
                  password: bcruptedPassword
                }
              },
              { new: true }
            );

            const transporter = nodemailer.createTransport({
              service: "email",
               host: "smtp.gmail.com" ,
               port: 465,
               auth: {
                 user: "sharathchanderg3@gmail.com",
                 pass: "drodhxsooferaydf",
               },
              // service: "email",
              // host: "mail.digitalraiz.co.in",
              // port: "587",
              // auth: {
              //   user: "no-reply@digitalraiz.co.in",
              //   pass: "6RwZAp&0s"
              // },
              // secureConnection: "false",
              // tls: {
              //   ciphers: "SSLv3",
              //   rejectUnauthorized: false
              // }
            });

            // console.log(senderEmail);
            let mailOpetions = {
              from: "sharathchanderg3@gmail.com",
              to: `${otp.emailId}`,
              subject: "Reset password",
              html: `<p>  <i style=style=" color : DarkBlue; "font-size: 15px"> You have successfully reset your password. </i> <br/> 
              <br/> <br/> <strong style=" color : Black; font-size: 15px">
              <p>Note: If this action has not been taken by you, then please contact Digital Raiz Creative Solutions, Hyderabad.  </p> </strong>`
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
              .json({
                message:
                  "The email sent successfully. Please login with your new password."
              });
          }
        } else {
          return res.status(400).json({ message: "Invalid OTP" });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "something went wrong!",error:err });
  }
};





// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const randomstring = require("randomstring");
// require("dotenv").config();
// const User = require("../Models/user_auth")

// //to encrypt the password
// const securePassword = async (password) => {
//   try {
//     const hashPassword = await bcrypt.hashSync(password, 10);
//     return hashPassword;
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// //set the path to sent email
// const sentEmailToReset = async (name, email, token) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       requireTLS: true,
//       //service:'gmail',
//       auth: {
//         user: 'sharathchanderg3@gmail.com',
//         pass: 'drodhxsooferaydf',
//       },
//     });
//     const mailOption = {
//       from: process.env.SAN_EMAIL, 
//       to: email,
//       subject: "Reset Password",
//       html: `<h1>Hello ${name}!!</h1>
//             <p>Please copy the <a href="http://localhost:4000/api/reset_password?token=${token}">link</a> to reset your password</p>`,
//     };
//     transporter.sendMail(mailOption, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("mail has sent to your registered email ", info.response);
//       }
//     });
//   } catch (err) {
//     res.status(400).send({ success: false, message: err.message });
//   }
// };

// //forgot passed to sent email
// exports.forgotpasword = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const userData = await User.findOne({ email: email });
//     if (userData) {
//       const randomString = randomstring.generate();
//       const data = await User.updateOne(
//         { email: email },
//         { $set: { token: randomString } }
//       );
//       //console.log(data)
//       sentEmailToReset(data.name, userData.email, randomString);
//       res
//         .status(200)
//         .send({
//           success: true,
//           meassage: "please check your email to reset your password",
//         });
//     }
//   } catch (err) {
//     res.status(400).send({ success: false, message: err.message });
//   }
// };

// //rest password API
// exports.resetPassword = async (req, res) => {
//   try {
//     const token = req.query.token;
//     console.log(token)
//     const tokenData = await User.findOne({ token: token });
//    //console.log(tokenData)
//     if (tokenData) {
//       const password = req.body.password;
//       const hashingPassword = await securePassword(password);
//       const userData = await User.findByIdAndUpdate(
//         { _id: tokenData._id },
//         { $set: { password: hashingPassword },token:" " },
//         { new: true }
//       );
//       console.log(userData)
//       res.status(200).send({ success:true, message:"your password is rested successfully",data:userData})
//     }
//   } catch (err) {
//     res.status(400).send({ success: false, message: err.message });
//   }
// };



// // update verifcation details
// exports.verifyCustomerDetails = async function (req, res) {
//   //   try {
//   let logDate = new Date().toISOString();

//   const changeCustVerfyDetails = await customerModel.updateOne(
//     { _id: req.params.id },
//     {
//       $set: {
//         emailVerify: req.body.emailVerify,
//         phoneVerify: req.body.phoneVerify,
//         faceVerify: req.body.faceVerify,
//         logDateModified: logDate
//       }
//     },
//     { new: true }
//   );

//   if (changeCustVerfyDetails) {
//     const showCustomer = await customerModel.findOne(
//       { _id: req.params.id },
//       { emailVerify: 1, phoneVerify: 1, faceVerify: 1 }
//     );

//     let custStatus;
//     if (
//       showCustomer.emailVerify == true &&
//       showCustomer.phoneVerify == true &&
//       showCustomer.faceVerify == true
//     ) {
//       custStatus = await customerModel.updateOne(
//         { _id: req.params.id },
//         {
//           $set: {
//             status: true,
//             logDateModified: logDate
//           }
//         },
//         { new: true }
//       );
//     } else {
//       custStatus = await customerModel.updateOne(
//         { _id: req.params.id },
//         {
//           $set: {
//             status: false,
//             logDateModified: logDate
//           }
//         },
//         { new: true }
//       );
//     }

//     res
//       .status(200)
//       .json({ message: "Customer verification updated successfully" });
//   }
//   //   } catch (err) {
//   //     res.status(400).json({ message: "Something went wrong..!" });
//   //   }
// };

// // manually verify customer
// exports.verifyCustManually = async function (req, res) {
//   try {
//     let logDate = new Date().toISOString();

//     const custStatus = await customerModel.updateOne(
//       { _id: req.params.id },
//       {
//         $set: {
//           status: req.body.status,
//           logDateModified: logDate
//         }
//       },
//       { new: true }
//     );

//     if (custStatus) {
//       res.status(200).json({ message: "Status updated successfully" });
//     }
//   } catch (err) {
//     res.status(400).json({ message: "Something went wrong..!" });
//   }
// };

// // disable customer
// exports.disableCustomer = async function (req, res) {
//   try {
//     let logDate = new Date().toISOString();

//     const changeCust = await customerModel.updateOne(
//       { _id: req.params.id },
//       {
//         $set: {
//           isBlocked: true,
//           logDateModified: logDate
//         }
//       },
//       { new: true }
//     );

//     if (changeCust) {
//       res.status(200).json({ message: "Customer disabled successfully" });
//     }
//   } catch (err) {
//     res.status(400).json({ message: "Something went wrong..!" });
//   }
// };

// // enable customer
// exports.enableCustomer = async function (req, res) {
//   try {
//     let logDate = new Date().toISOString();

//     const changeCust = await customerModel.updateOne(
//       { _id: req.params.id },
//       {
//         $set: {
//           isBlocked: false,
//           logDateModified: logDate
//         }
//       },
//       { new: true }
//     );

//     if (changeCust) {
//       res.status(200).json({ message: "Customer disabled successfully" });
//     }
//   } catch (err) {
//     res.status(400).json({ message: "Something went wrong..!" });
//   }
// };
