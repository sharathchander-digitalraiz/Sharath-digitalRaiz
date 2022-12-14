const express = require("express");
const custRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const customr = require("../../../controller/admin/customer.controller");
const customrWallet = require("../../../controller/admin/custWalletReport.controller");
const customrapp = require("../../../controller/app/customer.controller");
const {
  upload_userImages,
  upload_customerDocImages
} = require("../../../middleware/mediaupload");

// defining routes
custRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Customer initial route" });
});

/**************** customer self signup *************/
custRoute.post(
  "/customerselfregister",
  cors(),
  upload_userImages.none(),
  customr.customerSignup
);

/**************** customer registration by admin ***********/
custRoute.post(
  "/customeradminregister",
  verifyAdminToken,
  cors(),
  upload_customerDocImages.fields([
    {
      name: "profileImg",
      maxCount: 1
    },
    {
      name: "occupidImg",
      maxCount: 1
    },
    {
      name: "aadharFrontImg",
      maxCount: 1
    },
    {
      name: "aadharBackImg",
      maxCount: 1
    },
    {
      name: "voterIdFrontImg",
      maxCount: 1
    },
    {
      name: "voterIdBackImg",
      maxCount: 1
    },
    {
      name: "passportFrontImg",
      maxCount: 1
    },
    {
      name: "passportBackImg",
      maxCount: 1
    },
    {
      name: "dlFrontImg",
      maxCount: 1
    },
    {
      name: "dlBackImg",
      maxCount: 1
    },
    {
      name: "photoidImg",
      maxCount: 1
    },
    {
      name: "visaImg",
      maxCount: 1
    },
    {
      name: "interPassportImg",
      maxCount: 1
    },
    {
      name: "interDlFrontImg",
      maxCount: 1
    },
    {
      name: "interDlBackImg",
      maxCount: 1
    }
  ]),
  customr.customerSignup
);

/**************** customer signin ***************/
custRoute.post(
  "/customersignin",
  cors(),
  upload_userImages.none(),
  customr.customerSignin
);

/**************** customer get details by id *******/
custRoute.post(
  "/getdetailsbyid",
  verifyAdminToken,
  cors(),
  customr.getCustomerDetails
);

custRoute.post(
  "/getallcustomers",
  verifyAdminToken,
  cors(),
  customr.getAllcustomers
);

custRoute.post(
  "/getallactivecustomers",
  verifyAdminToken,
  cors(),
  customr.getAllActiveCustomers
);

custRoute.post(
  "/getcustbyemailorphone",
  verifyAdminToken,
  upload_userImages.none(),
  cors(),
  customr.getCustbyemailphone
);

/******************** Update customer details ************/
custRoute.put(
  "/editcustomerbyadmin/:id",
  verifyAdminToken,
  cors(),
  upload_customerDocImages.fields([
    {
      name: "profileImg",
      maxCount: 1
    },
    {
      name: "occupidImg",
      maxCount: 1
    },
    {
      name: "aadharFrontImg",
      maxCount: 1
    },
    {
      name: "aadharBackImg",
      maxCount: 1
    },
    {
      name: "voterIdFrontImg",
      maxCount: 1
    },
    {
      name: "voterIdBackImg",
      maxCount: 1
    },
    {
      name: "passportFrontImg",
      maxCount: 1
    },
    {
      name: "passportBackImg",
      maxCount: 1
    },
    {
      name: "dlFrontImg",
      maxCount: 1
    },
    {
      name: "dlBackImg",
      maxCount: 1
    },
    {
      name: "photoidImg",
      maxCount: 1
    },
    {
      name: "visaImg",
      maxCount: 1
    },
    {
      name: "interPassportImg",
      maxCount: 1
    },
    {
      name: "interDlFrontImg",
      maxCount: 1
    },
    {
      name: "interDlBackImg",
      maxCount: 1
    }
  ]),
  customr.editCustomerDetails
);

/**************** update customer verification **************/
custRoute.put(
  "/editcustomerverification/:id",
  verifyAdminToken,
  customr.verifyCustomerDetails
);
custRoute.patch(
  "/editcustomerstatus/:id",
  verifyAdminToken,
  upload_userImages.none(),
  customr.updateCustStatus
);

/**************** Enable - Disable customer **************/
custRoute.put("/enablecustomer/:id", verifyAdminToken, customr.enableCustomer);
custRoute.put(
  "/disablecustomer/:id",
  verifyAdminToken,
  customr.disableCustomer
);

/********************* change customer address ****************/
custRoute.put(
  "/updatecustomeraddress/:id",
  verifyAdminToken,
  upload_userImages.none(),
  customr.editCustomerAddress
);

/********************* customer wallet apis ****************/
custRoute.patch(
  "/addamounttocustwallet/:id",
  verifyAdminToken,
  upload_userImages.none(),
  customr.addAmountToCustWallet
);

custRoute.patch(
  "/updatecustwallet/:id",
  verifyAdminToken,
  upload_userImages.none(),
  customr.updateCustWallet
);

/******************* customer wallet history ********************/
custRoute.post(
  "/getallwallethistory",
  verifyAdminToken,
  upload_userImages.none(),
  customrWallet.getAllWalletHistory
);

// custRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = custRoute;
