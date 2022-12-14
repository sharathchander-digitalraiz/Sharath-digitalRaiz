// import libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import models
const customerModel = require("../../model/customer");
const adminAuthModel = require("../../model/adminAuth");
const employeeModel = require("../../model/employee");
const branchModel = require("../../model/branch");
const countryModel = require("../../model/country");
const documentModel = require("../../model/document");
const bookingModel = require("../../model/booking");
const custWalletModel = require("../../model/custWallet");

// add - signup customer
exports.customerSignup = function (req, res) {
  try {
    console.log(req.body);
    // console.log(req.files);
    customerModel
      .findOne({
        $or: [
          { email: req.body.email },
          { phone: req.body.phone },
          { dlNumber: req.body.dlNumber }
        ]
      })
      .exec(async function (er, cust) {
        if (cust) {
          return res.status(400).json({ message: "Customer already exist!" });
        } else {
          const countri = await countryModel.findOne(
            {
              _id: req.body.countryId
                ? req.body.countryId
                : "6385a2f4e4cc4eaf8914ff6c"
            },
            { countryName: 1 }
          );

          console.log(countri);

          const pass = bcrypt.hashSync(req.body.password, 10);

          let logDate = new Date().toISOString();

          const custObj = new customerModel({
            customerName: req.body.customerName,
            phone: req.body.phone,
            email: req.body.email,
            password: pass,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            profilePic: req.files.profileImg
              ? req.files.profileImg[0].path
              : console.log("No Img"),
            occupation: req.body.occupation,
            occupationdetails: req.body.occupationdetails,
            occupationIdCard: req.files.occupidImg
              ? req.files.occupidImg[0].path
              : console.log("No Img"),
            address: req.body.address,
            residentStatus: req.body.residentStatus,
            dlNumber: req.body.dlNumber,
            countryId: req.body.countryId
              ? req.body.countryId
              : "6385a2f4e4cc4eaf8914ff6c",
            countryName: countri.countryName,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          custObj.save(function (eror, datta) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "Customer details could not be added" });
            }
            if (datta) {
              const documentObj = new documentModel({
                customerId: datta._id,
                customerName: datta.customerName,
                residentStatus: datta.residentStatus,
                documentType: req.body.documentType,
                aadharNumber: req.body.aadharNumber,
                aadharFront: req.files.aadharFrontImg
                  ? req.files.aadharFrontImg[0].path
                  : console.log("No image found"),
                aadharBack: req.files.aadharBackImg
                  ? req.files.aadharBackImg[0].path
                  : console.log("No image found"),
                voterIdNumber: req.body.voterIdNumber,
                voterIdFront: req.files.voterIdFrontImg
                  ? req.files.voterIdFrontImg[0].path
                  : console.log("No image found"),
                voterIdBack: req.files.voterIdBackImg
                  ? req.files.voterIdBackImg[0].path
                  : console.log("No image found"),
                passportFront: req.files.passportFrontImg
                  ? req.files.passportFrontImg[0].path
                  : console.log("No image found"),
                passportBack: req.files.passportBackImg
                  ? req.files.passportBackImg[0].path
                  : console.log("No image found"),
                interPassport: req.files.interPassportImg
                  ? req.files.interPassportImg[0].path
                  : console.log("No image found"),
                photoIdProof: req.files.photoidImg
                  ? req.files.photoidImg[0].path
                  : console.log("No image found"),
                visaCopy: req.files.visaImg
                  ? req.files.visaImg[0].path
                  : console.log("No image found"),
                dlFront: req.files.dlFrontImg
                  ? req.files.dlFrontImg[0].path
                  : console.log("No image found"),
                dlBack: req.files.dlBackImg
                  ? req.files.dlBackImg[0].path
                  : console.log("No image found"),
                interDlFront: req.files.interDlFrontImg
                  ? req.files.interDlFrontImg[0].path
                  : console.log("No image found"),
                interDlBack: req.files.interDlBackImg
                  ? req.files.interDlBackImg[0].path
                  : console.log("No image found")
              });

              documentObj.save();

              res
                .status(200)
                .json({ message: "Customer details added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Invalid admin or branch data..!" });
  }
};

// customer signin
exports.customerSignin = async function (req, res) {
  try {
    const user = await customerModel.findOne(
      { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
      { _id: 1, customerName: 1, email: 1, phone: 1, password: 1, isBlocked: 1 }
    );
    if (user) {
      // console.log(user)
      let passward = req.body.password;
      const pass = bcrypt.compareSync(passward, user.password);

      console.log(pass);
      console.log(user);
      // if (pass && user.status == true) {
      //   // generate JWT Token
        let token = jwt.sign(
          {
            userId: user._id,
            password: user.password,
            role: user.role
          },
          process.env.ADMIN_SECRET_KEY,
          { expiresIn: process.env.ADMIN_EXPIRY_DATE }
        );

        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "Customer"
        };
        res.status(200).json({ token: token, user: userData });
      } else {
        res.status(400).json({
          status: 400,
          message: "Invalid user or data"
        });
      }
    // } else {
    //   res.status(404).json({ status: 404, message: "No User Found" });
    // }
  } catch (err) {
    // console.log(err);
    res
      .status(400)
      .json({ error: err, status: 500, message: "Invalid email or password" });
  }
};

// get customer details
exports.getCustomerDetails = async function (req, res) {
  // try {
  let logDate = new Date().toISOString();

  /********************** Upcoming Bookings **************/
  const upcomingBooking = await bookingModel
    .find({
      _id: req.body._id,
      isActive: true,
      status: "accepted",
      fromDate: { $gt: logDate }
    })
    .countDocuments();

  /******************** Running Booking ****************/
  const runningBooking = await bookingModel
    .find({
      _id: req.body._id,
      isActive: true,
      status: "accepted",
      fromDate: { $gte: logDate },
      toDate: { $lte: logDate }
    })
    .countDocuments();

  /******************* Completed Booking ******************/
  const completedBooking = await bookingModel
    .find({ _id: req.body._id, isActive: true, status: "completed" })
    .countDocuments();

  let totaBooking = upcomingBooking + runningBooking + completedBooking;

  const custResult = await customerModel.findById(
    { _id: req.body._id },
    {
      _id: 1,
      customerName: 1,
      phone: 1,
      email: 1,
      gender: 1,
      dateOfBirth: 1,
      profilePic: 1,
      occupation: 1,
      occupationdetails: 1,
      occupationIdCard: 1,
      address: 1,
      residentStatus: 1,
      dlNumber: 1,
      countryId: 1,
      countryName: 1,
      appFcmToken: 1,
      appServerKey: 1,
      wallet: 1,
      logDateCreated: 1,
      logDateModified: 1,
      status: 1,
      isBlocked: 1
    }
  );

  console.log(custResult);

  const documentResult = await documentModel.findOne(
    {
      customerId: req.body._id
    },
    {
      _id: 1,
      customerId: 1,
      customerName: 1,
      residentStatus: 1,
      documentType: 1,
      aadharNumber: 1,
      aadharFront: 1,
      aadharBack: 1,
      voterIdNumber: 1,
      voterIdFront: 1,
      voterIdBack: 1,
      passportFront: 1,
      passportBack: 1,
      interPassport: 1,
      photoIdProof: 1,
      visaCopy: 1,
      dlFront: 1,
      dlBack: 1,
      interDlFront: 1,
      interDlBack: 1
    }
  );

  let customerResult = {
    _id: custResult._id,
    customerName: custResult.customerName,
    phone: custResult.phone,
    email: custResult.email,
    gender: custResult.gender,
    dateOfBirth: custResult.dateOfBirth,
    profilePic: custResult.profilePic,
    occupation: custResult.occupation,
    occupationdetails: custResult.occupationdetails,
    occupationIdCard: custResult.occupationIdCard,
    address: custResult.address,
    residentStatus: custResult.residentStatus,
    dlNumber: custResult.dlNumber,
    countryId: custResult.countryId,
    countryName: custResult.countryName,
    appFcmToken: custResult.appFcmToken,
    appServerKey: custResult.appServerKey,
    wallet: custResult.wallet,
    logDateCreated: custResult.logDateCreated,
    logDateModified: custResult.logDateModified,
    status: custResult.status,
    isBlocked: custResult.isBlocked,
    upcomingBooking: upcomingBooking,
    runningBooking: runningBooking,
    completedBooking: completedBooking,
    totaBooking: totaBooking,
    documentId: documentResult ? documentResult._id : "",
    customerId: documentResult ? documentResult.customerId : "",
    // residentStatus: documentResult ? documentResult.residentStatus : "",
    documentType: documentResult ? documentResult.documentType : "",
    aadharNumber: documentResult ? documentResult.aadharNumber : "",
    aadharFront: documentResult ? documentResult.aadharFront : "",
    aadharBack: documentResult ? documentResult.aadharBack : "",
    voterIdNumber: documentResult ? documentResult.voterIdNumber : "",
    voterIdFront: documentResult ? documentResult.voterIdFront : "",
    voterIdBack: documentResult ? documentResult.voterIdBack : "",
    passportFront: documentResult ? documentResult.passportFront : "",
    passportBack: documentResult ? documentResult.passportBack : "",
    interPassport: documentResult ? documentResult.interPassport : "",
    photoIdProof: documentResult ? documentResult.photoIdProof : "",
    visaCopy: documentResult ? documentResult.visaCopy : "",
    dlFront: documentResult ? documentResult.dlFront : "",
    dlBack: documentResult ? documentResult.dlBack : "",
    interDlFront: documentResult ? documentResult.interDlFront : "",
    interDlBack: documentResult ? documentResult.interDlBack : ""
  };

  res.status(200).json({ message: "Success", customerResult });
  // } catch (err) {
  //   res.status(401).json({ status: 401, message: "Bad request" });
  // }
};

// get all customers list - for admin
exports.getAllcustomers = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const custsResult = await customerModel
      .find({
        $or: [
          { customerName: searchCodtion },
          { email: searchCodtion },
          { phone: searchCodtion },
          { countryName: searchCodtion }
        ]
      })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", custsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active customers list
exports.getAllActiveCustomers = async function (req, res) {
  try {
    const custActiveResult = await customerModel.find({ status: true });

    res.status(200).json({ message: "Success", custActiveResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all verified customers list
exports.getAllVerifiedCustomers = async function (req, res) {
  try {
    const custVerifiedResult = await customerModel.find({ status: true });

    res.status(200).json({ message: "Success", custVerifiedResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update customer details
exports.editCustomerDetails = async function (req, res) {
  // try {
  // console.log(req.files);
  console.log(req.body);
  const countri = await countryModel.findOne(
    {
      _id: req.body.countryId ? req.body.countryId : "6385a2f4e4cc4eaf8914ff6c"
    },
    { countryName: 1 }
  );

  let logDate = new Date().toISOString();

  // id is customer document id
  const changeCust = await customerModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        customerName: req.body.customerName,
        phone: req.body.phone,
        email: req.body.email,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        profilePic: req.files.profileImg
          ? req.files.profileImg[0].path
          : console.log("No Img"),
        occupation: req.body.occupation,
        occupationdetails: req.body.occupationdetails,
        occupationIdCard: req.files.occupidImg
          ? req.files.occupidImg[0].path
          : console.log("No Img"),
        address: req.body.address,
        residentStatus: req.body.residentStatus,
        dlNumber: req.body.dlNumber,
        countryId: req.body.countryId
          ? req.body.countryId
          : "6385a2f4e4cc4eaf8914ff6c",
        countryName: countri.countryName,
        logDateModified: logDate,
        status: req.body.status
      }
    },
    { new: true }
  );

  const changeDocs = await documentModel.updateOne(
    { customerId: req.params.id },
    {
      $set: {
        customerName: req.body.customerName,
        residentStatus: req.body.residentStatus,
        documentType: req.body.documentType,
        aadharNumber: req.body.aadharNumber,
        aadharFront: req.files.aadharFrontImg
          ? req.files.aadharFrontImg[0].path
          : console.log("No image found"),
        aadharBack: req.files.aadharBackImg
          ? req.files.aadharBackImg[0].path
          : console.log("No image found"),
        voterIdNumber: req.body.voterIdNumber,
        voterIdFront: req.files.voterIdFrontImg
          ? req.files.voterIdFrontImg[0].path
          : console.log("No image found"),
        voterIdBack: req.files.voterIdBackImg
          ? req.files.voterIdBackImg[0].path
          : console.log("No image found"),
        passportFront: req.files.passportFrontImg
          ? req.files.passportFrontImg[0].path
          : console.log("No image found"),
        passportBack: req.files.passportBackImg
          ? req.files.passportBackImg[0].path
          : console.log("No image found"),
        interPassport: req.files.interPassportImg
          ? req.files.interPassportImg[0].path
          : console.log("No image found"),
        photoIdProof: req.files.photoidImg
          ? req.files.photoidImg[0].path
          : console.log("No image found"),
        visaCopy: req.files.visaImg
          ? req.files.visaImg[0].path
          : console.log("No image found"),
        dlFront: req.files.dlFrontImg
          ? req.files.dlFrontImg[0].path
          : console.log("No image found"),
        dlBack: req.files.dlBackImg
          ? req.files.dlBackImg[0].path
          : console.log("No image found"),
        interDlFront: req.files.interDlFrontImg
          ? req.files.interDlFrontImg[0].path
          : console.log("No image found"),
        interDlBack: req.files.interDlBackImg
          ? req.files.interDlBackImg[0].path
          : console.log("No image found")
      }
    },
    { new: true }
  );

  if (changeDocs) {
    res.status(200).json({ message: "Customer details updated successfully" });
  }
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// update verifcation details
exports.verifyCustomerDetails = async function (req, res) {
  //   try {
  let logDate = new Date().toISOString();

  const changeCustVerfyDetails = await customerModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        emailVerify: req.body.emailVerify,
        phoneVerify: req.body.phoneVerify,
        faceVerify: req.body.faceVerify,
        logDateModified: logDate
      }
    },
    { new: true }
  );

  if (changeCustVerfyDetails) {
    const showCustomer = await customerModel.findOne(
      { _id: req.params.id },
      { emailVerify: 1, phoneVerify: 1, faceVerify: 1 }
    );

    let custStatus;
    if (
      showCustomer.emailVerify == true &&
      showCustomer.phoneVerify == true &&
      showCustomer.faceVerify == true
    ) {
      custStatus = await customerModel.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: true,
            logDateModified: logDate
          }
        },
        { new: true }
      );
    } else {
      custStatus = await customerModel.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: false,
            logDateModified: logDate
          }
        },
        { new: true }
      );
    }

    res
      .status(200)
      .json({ message: "Customer verification updated successfully" });
  }
  //   } catch (err) {
  //     res.status(400).json({ message: "Something went wrong..!" });
  //   }
};

// manually verify customer
exports.verifyCustManually = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const custStatus = await customerModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (custStatus) {
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable customer
exports.disableCustomer = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeCust = await customerModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false,
          isBlocked: true,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCust) {
      res.status(200).json({ message: "Customer disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// enable customer
exports.enableCustomer = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeCust = await customerModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: true,
          isBlocked: false,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCust) {
      res.status(200).json({ message: "Customer enabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// edit customer adderess
exports.editCustomerAddress = async function (req, res) {
  try {
    const countri = await countryModel.findOne(
      { _id: req.body.countryId },
      { countryName: 1 }
    );
    // console.log(countri);
    // console.log(req.body);

    const changeAdd = await customerModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          countryId: req.body.countryId,
          countryName: countri.countryName,
          address: req.body.address
        }
      },
      { new: true }
    );

    if (changeAdd) {
      res
        .status(200)
        .json({ message: "Customer address updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get customer by either email or phone
exports.getCustbyemailphone = async function (req, res) {
  try {
    const custUser = await customerModel.findOne(
      {
        _id: req.body._id,
        status: true
      },
      { email: 1, phone: 1 }
    );

    res.status(200).json({ message: "Success", custUser });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// add amount to customer wallet
exports.addAmountToCustWallet = async function (req, res) {
  // try {
  const showCustomer = await customerModel.findOne(
    { _id: req.params.id },
    { customerName: 1, phone: 1, email: 1 }
  );

  let logDate = new Date().toISOString();

  const walletResult = await customerModel.updateOne(
    { _id: req.params.id }, // customer doc id
    {
      $set: {
        wallet: req.body.wallet
      }
    },
    { new: true }
  );

  const walletObj = new custWalletModel({
    customerId: req.params.id,
    customerName: showCustomer.customerName,
    customerPhone: showCustomer.phone,
    customeremail: showCustomer.email,
    wallet: req.body.wallet,
    logDateCreated: logDate,
    logDateModified: logDate
  });

  walletObj.save();

  if (walletResult) {
    res.status(200).json({ message: "Amount added in the wallet" });
  }
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// get customer wallet details
exports.updateCustWallet = async function (req, res) {
  try {
    const showCustomer = await customerModel.findOne(
      { _id: req.params.id },
      { customerName: 1, phone: 1, email: 1 }
    );

    let logDate = new Date().toISOString();

    const walletResult = await customerModel.updateOne(
      { _id: req.params.id }, // customer doc id
      {
        $set: {
          wallet: req.body.wallet,
          totalCharges: req.body.totalCharges,
          reasonOfCharges: req.body.reasonOfCharges
        }
      },
      { new: true }
    );

    const walletObj = new custWalletModel({
      customerId: req.params.id,
      customerName: showCustomer.customerName,
      customerPhone: showCustomer.phone,
      customeremail: showCustomer.email,
      wallet: req.body.wallet,
      totalCharges: req.body.totalCharges,
      reasonOfCharges: req.body.reasonOfCharges,
      logDateCreated: logDate,
      logDateModified: logDate
    });

    walletObj.save();

    if (walletResult) {
      res.status(200).json({ message: "Wallet updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// verify/ refute the customer status
exports.updateCustStatus = async function (req, res) {
  try {
    const custStatus = await customerModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status
        }
      },
      { new: true }
    );

    if (custStatus) {
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
