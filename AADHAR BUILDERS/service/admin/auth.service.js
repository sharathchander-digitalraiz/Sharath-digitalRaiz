const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// model
const adminModel = require("../../model/adminAuth");
const operationModel = require("../../model/operation");
// const { adminSendForgetPasswordMail } = require("../../helper/mail");

class Auth {
  register(adminData) {
    return new Promise(async (res, rej) => {
      // console.log(adminData)
      try {
        const user = await adminModel.findOne(
          { email: adminData.email },
          { _id: 1, email: 1, phone: 1, role: 1, password: 1 }
        );
        if (user) {
          console.log("user");
          rej({
            status: 400,
            message: "email already exist please try again with different email"
          });
        } else {
          let newAdmin = adminModel(adminData);
          let data = await newAdmin.save();
          // console.log(data);
          res({ message: "register" });
        }
      } catch (err) {
        console.log("eror", err);
        if (err.code === 11000) {
          rej({
            status: 400,
            message: "email already exist please try again with different email"
          });
          return;
        }
        rej({ error: err, status: 500, message: "Internal server Error" });
      }
    });
  }

  login(email, password) {
    return new Promise(async (res, rej) => {
      try {
        const user = await adminModel.findOne(
          { email },
          { _id: 1, email: 1, phone: 1, role: 1, password: 1, status: 1 }
        );
        if (user) {
          // console.log(user)
          const pass = bcrypt.compareSync(password, user.password);

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
            res({ token: token, user: user });
          } else if (
            pass &&
            user.role != "superadmin" &&
            user.status === true
          ) {
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
            res({ token: token, user: user });
          } else {
            rej({
              status: 400,
              message: "Invalid user or data"
            });
          }
        } else {
          rej({ status: 404, message: "No User Found" });
        }
      } catch (err) {
        // console.log(err);
        rej({ error: err, status: 500, message: "Internal server Error" });
      }
    });
  }

  adminprofile(userId) {
    return new Promise(async (res, rej) => {
      try {
        console.log(userId);
        const user = await adminModel
          .findOne({ _id: userId, isDelete: false }, {})
          .exec();
        if (user) {
          res(user);
        } else {
          rej({ status: 400, message: "No data found" });
        }
      } catch (err) {
        rej({ error: err, status: 500, message: "Internal server Error" });
      }
    });
  }

  updateProfile(userdetails, userid) {
    return new Promise(async (res, rej) => {
      try {
        console.log(userdetails, userid);
        const user = await adminModel
          .updateOne(
            { _id: userid },
            {
              $set: {
                firstName: userdetails.firstName,
                lastName: userdetails.lastName,
                email: userdetails.email,
                phone: userdetails.phone,
                address: userdetails.address
              }
            },
            {
              new: true
            }
          )
          .exec();
        res({ message: "update", user });
      } catch (err) {
        rej({ error: err, status: 500, message: "Internal server Error" });
      }
    });
  }

  uploadProfileImg(userId, dataImg) {
    return new Promise(async (res, rej) => {
      try {
        let result = await adminModel.updateOne(
          { _id: userId },
          {
            $set: { profileImage: dataImg }
          },
          { new: true }
        );
        res();
      } catch (err) {
        console.log(err);
        rej({ error: err, status: 500, message: "Internal Server Error" });
      }
    });
  }

  loginOps(userId, mySocket) {
    return new Promise(async (res, rej) => {
      try {
        console.log(userId);
        let sumId;
        let seshanId;
        const roes = await operationModel.find().countDocuments();

        if (roes > 0) {
          const data = await operationModel.findOne().sort({ _id: -1 });
          let x = data.session_id;
          let a = parseInt(x);
          sumId =
            a != undefined ? a + parseInt("0000001") : parseInt("0000001");
          seshanId = String(sumId).padStart(8, 0);
          console.log(seshanId);
        } else {
          sumId = parseInt("0000001");
          seshanId = String(sumId).padStart(8, 0);
          console.log(seshanId);
        }

        // let mySocket = req.socket.remoteAddress;
        let ssoket = mySocket.toString();
        // console.log(ssoket);
        let myip = ssoket.slice(7, 22);

        const userr = await adminModel.findOne(
          { _id: userId },
          { firstName: 1, lastName: 1, email: 1 }
        );

        let logDate = new Date();
        let logDay = `${logDate.getFullYear()}-${
          logDate.getMonth() + 1
        }-${logDate.getDate()} ${logDate.getHours()}:${logDate.getMinutes()}`;

        const opsObj = new operationModel({
          user_id: userId,
          userName: `${userr.firstName} ${userr.lastName}`,
          email: userr.email,
          loginTime: logDay,
          ipAddress: myip,
          session_id: seshanId
        });

        console.log(opsObj);
        let data = opsObj.save(function (eror, sesion) {
          if (eror) {
            rej({ status: 400, message: "Operation data could not be saved" });
          }
          if (sesion) {
            res({ status: 200, message: "Operation data saved successfully" });
          }
        });
      } catch (err) {
        console.log(err);
        rej({ error: err, status: 500, message: "Internal Server Error" });
      }
    });
  }

  // change_pasword(email) {
  //   return new Promise(async (res, rej) => {
  //     try {
  //       const user = await adminModel.findOne({ email }).exec();
  //       if (user) {
  //         adminSendForgetPasswordMail(user);
  //         //res({ user })
  //       } else {
  //         rej({ status: 404, message: "Email id does not exists" });
  //       }
  //       //	res(user);
  //     } catch (err) {
  //       rej({ error: err, status: 500, message: "Internal server Error" });
  //     }
  //   });
  // }

  update_password(password, newpassword, confirmpassword, userId) {
    return new Promise(async (res, rej) => {
      try {
        if (password == null || password == undefined || password == "") {
          return rej({ status: 404, message: "Please enter current password" });
        }

        console.log(userId);

        const userPass = await adminModel.findOne(
          { _id: userId },
          { password: 1 }
        );

        let currentPassVal = bcrypt.compareSync(password, userPass.password);

        if (currentPassVal == true) {
          if (newpassword == confirmpassword) {
            const bcruptedPassword = bcrypt.hashSync(confirmpassword, 10);

            await adminModel.updateOne(
              { _id: userId },
              { $set: { password: bcruptedPassword } },
              { new: true }
            );
            res();
          } else {
            rej({ status: 404, message: "passwords does not match" });
          }
        } else {
          rej({ status: 404, message: "Invalid password" });
        }
        //	res(user);
      } catch (err) {
        console.log(err);
        rej({ error: err, status: 500, message: "Internal server Error" });
      }
    });
  }
}

module.exports = Auth;
