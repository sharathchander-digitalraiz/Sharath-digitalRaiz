const express = require("express");
const bookingAppRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const appBooking = require("../../../controller/app/booking.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
bookingAppRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car Booking App initial route" });
});

/**************** car Booking apis *************/
bookingAppRoute.post(
  "/addappcarbooking",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.addBooking
);

bookingAppRoute.post(
  "/UpdatePayment",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.UpdatePayment
);

bookingAppRoute.post(
  "/mybookings",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.getmybookings
);
bookingAppRoute.post(
  "/getmyhistory",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.getmyhistory
);


bookingAppRoute.post(
  "/coupons",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.coupons
);
bookingAppRoute.post(
  "/drivepoints",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.drivepoints
);


bookingAppRoute.post(
  "/getprices",
  verifyAdminToken,
  upload_userImages.none(),
  appBooking.getcarprice
);

/****************Get the sum of drive points router*****************/
bookingAppRoute.get(
  "/drive-points",
  verifyAdminToken,
  appBooking.drivepoints
);

// bookingAppRoute.post(
//   "/getallcarbrands",
//   verifyAdminToken,
//   upload_userImages.none(),
//   appBooking.getAllCarBrand
// );

// bookingAppRoute.post(
//   "/getallactivecarbrands",
//   verifyAdminToken,
//   upload_userImages.none(),
//   appBooking.getAllActiveCarBrand
// );

// bookingAppRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = bookingAppRoute;
