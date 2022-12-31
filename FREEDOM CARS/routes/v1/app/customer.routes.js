const express = require("express");
const custAppRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const customr = require("../../../controller/admin/customer.controller");
const customrapp = require("../../../controller/app/customer.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
custAppRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Customer App initial route" });
});

/**************** customer self APP signup, signin *************/
custAppRoute.post(
  "/customerappselfregister",
  upload_userImages.single('avatar'),
  customrapp.customerAppSignup
);
custAppRoute.post(
  "/customerappsignin",
  upload_userImages.none(),
  customrapp.customerAppSignin
);
/**************** customer change password router*************/
custAppRoute.post(
  "/customer-change-password",
  verifyAdminToken,
  upload_userImages.none(),
  customrapp.changePassword
); 
/**************** notification bell router *************/
custAppRoute.get(
  "/notificationbell",
  verifyAdminToken,
  customrapp.getNotification
); 

//update
custAppRoute.put(
  "/change-notificationbell",
  verifyAdminToken,
  customrapp.updateNotification
);
/*************** get customer info Appp side ************/
custAppRoute.post(
  "/customerappgetdetails",
  verifyAdminToken,
  upload_userImages.none(),
  customr.getCustomerDetails
);

/*************** update customer info App side ************/
custAppRoute.put(
  "/edit-customerInfo",
  verifyAdminToken,
  upload_userImages.single('avatar'),
  customrapp.editCustomerDetails
);

/*************** update customer info Exist App side ************/
custAppRoute.post(
  "/existcustomerInfo",
  verifyAdminToken,
  upload_userImages.single('avatar'),
  customrapp.customerExistStatus
);

/***************customer withdrawal request App side************/
custAppRoute.put(
  "/withdrawal-wallet",
  verifyAdminToken,
  customrapp.withdrawalWalletAmount
);

/***************customer forgot password App side************/
//sent OTP
custAppRoute.post(
  "/otp-request",
  customrapp.generateOtp
);
//compare OTP
custAppRoute.post(
  "/otp-check",
  customrapp.compareOtp
);

//reset password
custAppRoute.post(
  "/reset-password",
  customrapp.resetPassword
);
module.exports = custAppRoute;
