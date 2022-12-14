const express = require("express");
const bookingRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const book = require("../../../controller/admin/booking.controller");
const report = require("../../../controller/admin/bookingReport.controller");
const {
  upload_userImages,
  upload_securityDepositeImages
} = require("../../../middleware/mediaupload");

// defining routes
bookingRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Booking initial route" });
});

/**************** Booking apis *************/
bookingRoute.post(
  "/addbooking",
  verifyAdminToken,
  upload_securityDepositeImages.single("depositImg"),
  book.addBooking
);

bookingRoute.post(
  "/getbookingbyid",
  verifyAdminToken,
  upload_securityDepositeImages.none(),
  book.getBookingDetails
);

bookingRoute.post(
  "/getallbookings",
  verifyAdminToken,
  upload_securityDepositeImages.none(),
  book.getAllBookings
);

bookingRoute.post(
  "/getallpendingbookings",
  verifyAdminToken,
  upload_securityDepositeImages.none(),
  book.getAllPendingBookings
);

bookingRoute.post(
  "/getallacceptedbookings",
  verifyAdminToken,
  upload_securityDepositeImages.none(),
  book.getAllAcceptedBookings
);

bookingRoute.post(
  "/getallcancelledbookings",
  verifyAdminToken,
  upload_securityDepositeImages.none(),
  book.getAllCancelledBookings
);

bookingRoute.post(
  "/getallcompletedbookings",
  verifyAdminToken,
  upload_securityDepositeImages.none(),
  book.getAllCompletedBookings
);

bookingRoute.put(
  "/editbooking/:id",
  verifyAdminToken,
  upload_securityDepositeImages.single("depositImg"),
  book.editBooking
);

bookingRoute.post(
  "/getprices",
  verifyAdminToken,
  upload_userImages.none(),
  book.getcarprice
);

// bookingRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

bookingRoute.put(
  "/editdrivepoint/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.updateDrivePoints
);

bookingRoute.put(
  "/editbookingstatus/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.editBookingStatus
);

bookingRoute.put(
  "/disablebooking/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.disableBooking
);

bookingRoute.put(
  "/enablebooking/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.enableBooking
);

bookingRoute.post(
  "/addpaymentbybookingid/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.addPaymentByBookingid
);

bookingRoute.patch(
  "/editdeposit/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.editDeposite
);

/********************* Security deposite apis **************/
bookingRoute.post(
  "/addsecuritydep/:id",
  verifyAdminToken,
  upload_securityDepositeImages.single("depositImg"),
  book.addSecurityDeposite
);

bookingRoute.put(
  "/editsecuritydep/:id",
  verifyAdminToken,
  upload_userImages.none(),
  book.editSecurityDeposite
);

/****************** Booking Report api ************/
bookingRoute.post(
  "/carbookingreport",
  verifyAdminToken,
  upload_userImages.none(),
  report.carBookingReport
);

module.exports = bookingRoute;
