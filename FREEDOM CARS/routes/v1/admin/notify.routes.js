const express = require("express");
const notifyRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const notify = require("../../../controller/admin/notification.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
notifyRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Notification initial route" });
});

/**************** customer self signup *************/
notifyRoute.post(
  "/addnotification",
  verifyAdminToken,
  upload_userImages.none(),
  //   upload_userImages.single("notifImg"),
  notify.createNotification
);

notifyRoute.post(
  "/getall-notification",
  verifyAdminToken,
  upload_userImages.none(),
  //   upload_userImages.single("notifImg"),
  notify.showAllNotification
);

notifyRoute.post(
  "/edit-notification",
  verifyAdminToken,
  upload_userImages.none(),
  //   upload_userImages.single("notifImg"),
  notify.editNotification
);

notifyRoute.post(
  "/remove-notification", // permanently delete
  verifyAdminToken,
  upload_userImages.none(),
  //   upload_userImages.single("notifImg"),
  notify.removeNotification
);

// notifyRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = notifyRoute;
