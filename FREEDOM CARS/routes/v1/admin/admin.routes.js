const express = require("express");
const adminRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const adminControl = require("../../../controller/admin/adminAuth.controller");
const admindash = require("../../../controller/admin/adminDashboard.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");
const branchRoute = require("./branch.routes");
const deptRoute = require("./department.routes");
const roleandpermitRoute = require("./roleAndPermission.routes");
const employeeRoute = require("./employee.routes");
const custRoute = require("./customer.routes");
const contRoute = require("./country.routes");
const driverRoute = require("./deriver.routes");
const carBrandRoute = require("./carBrand.routes");
const carRoute = require("./car.routes");
const carBannerRoute = require("./carBanner.routes");
const notifyRoute = require("./notify.routes");
const versionRoute = require("./carVersion.routes");
const carModelRoute = require("./carModel.routes");
const feature = require("./feature.routes");
const coupon_router = require("./coupon.routes");
const specRoute = require("./carSpecs.routes");
const bookingRoute = require("./booking.routes");
const securityDeposit = require("./securityDeposite.route");
const invoice = require("./invoice.router")

// defining routes
adminRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Admin initial route" });
});

adminRoute.post(
  "/adminregister",
  upload_userImages.none(),
  adminControl.adminSignup
);
adminRoute.post(
  "/adminsignin",
  upload_userImages.none(),
  adminControl.adminSignin
);
adminRoute.post(
  "/admingetprofile",
  verifyAdminToken,
  upload_userImages.none(),
  adminControl.getAdminProfile
);
adminRoute.put(
  "/adminupdateprofile/:id",
  verifyAdminToken,
  upload_userImages.single("profileImg"),
  adminControl.editProfile
);
adminRoute.patch(
  "/adminchangepass",
  verifyAdminToken,
  upload_userImages.none(),
  adminControl.update_password
);
adminRoute.patch(
  "/adminupdateprofileimage/:id",
  verifyAdminToken,
  upload_userImages.single("profileImg"),
  adminControl.editProfileImage
);

/*********************** ADMIN DASHBOARD ********************/
adminRoute.post(
  "/getadmindashitems",
  verifyAdminToken,
  upload_userImages.none(),
  admindash.getDashboardItems
);

/****************** branch apis ****************/
adminRoute.use("/branch", branchRoute);

/****************** department apis ************/
adminRoute.use("/dept", deptRoute);

/****************** roles and permissions api ************/
adminRoute.use("/roleandpermit", roleandpermitRoute);

/****************** Employee apis **************/
adminRoute.use("/employee", employeeRoute);

/****************** customer apis **************/
adminRoute.use("/customer", custRoute);

/****************** country apis ************/
adminRoute.use("/country", contRoute);

/****************** Driver apis ************/
adminRoute.use("/driver", driverRoute);

/****************** Car brand apis ************/
adminRoute.use("/brand", carBrandRoute);

/****************** Car add apis ************/
adminRoute.use("/car", carRoute);

/****************** Car Banner apis ************/
adminRoute.use("/carBanner", carBannerRoute);

/****************** Notification apis ************/
adminRoute.use("/notify", notifyRoute);

/****************** Varsion apis ************/
adminRoute.use("/carversion", versionRoute);

/****************** Car model apis ************/
adminRoute.use("/carmodel", carModelRoute);

// adminRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

/****************** Car Feature apis ************/
adminRoute.use("/carfeature", feature);

/****************** Car Specifications apis ************/
adminRoute.use("/carspecs", specRoute);

/****************** Coupon apis ************/
adminRoute.use("/coupons", verifyAdminToken, coupon_router);

/****************** Car Booking apis ************/
adminRoute.use("/carbooking", bookingRoute);

/*********security dposite *******/
adminRoute.use("/security", securityDeposit);

/*********invoice repoprt*******/
adminRoute.use("invoice",invoice);

module.exports = adminRoute;
