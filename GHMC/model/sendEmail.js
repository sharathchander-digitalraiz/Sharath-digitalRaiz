const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const userModel = require("../../model/users");

dotenv.config();

// generate the OTP and update the user collection for respective user and send email to that perticular user's email address
exports.sendOtpEmail = async function (req, res) {
  try {
    let num = "1234567890";
    let otp = "";
    let oneTimePassword;
    let senderEmail = req.body.email;

    for (let i = 0; i < 4; i++) {
      otp = otp + num[Math.floor(Math.random() * 10)];
    }

    oneTimePassword = otp;

    const updateOtp = await userModel.updateOne(
      { email: senderEmail },
      { $set: { emailOtp: oneTimePassword } },
      { new: true }
    );

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "digitalraiz.jaisriram@gmail.com",
        pass: "Jaisriram143",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOpetions = {
      from: "digitalraiz.jaisriram@gmail.com",
      to: `${senderEmail}`,
      subject: "Forgot password OTP",
      html: `<p> OTP for changing the password is  OTP\:
        <strong style=" color : limegreen; font-size: 20px"> ${oneTimePassword} </strong> </p> `,
    };

    transporter.sendMail(mailOpetions, function (err, success) {
      if (err) {
        console.log(err);
      }
      if (success) {
        console.log("Email sent successfully");
      }
    });

    if (updateOtp) {
      res
        .status(200)
        .json({ message: "OTP sent successfully to specified email..!" });
    }
  } catch (err) {}
};

// compare Otp
exports.compareOtp = async function (req, res) {
  try {
    const compareOtp = await userModel.findOne(
      { emailOtp: req.body.emailOtp },
      { _id: 0, emailOtp: 1 }
    );
    if(compareOtp.emailOtp == req.body.emailOtp  ){
      res.status(200).json({ message: "OTP verified!" })
    }
  } catch (err) {
    res.status(400).json({ message: "OTP does not match..!" });
  }
};
