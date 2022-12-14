const express = require("express");
const notifyAppRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const notify = require("../../../controller/admin/notification.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
notifyAppRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Notification initial App route" });
});

/**************** customer self signup *************/
notifyAppRoute.post(
  "/getusernotifications",
  verifyAdminToken,
  upload_userImages.none(),
  //   upload_userImages.single("notifImg"),
  notify.getAllNotificationbyUserId
);

notifyAppRoute.put(
  "/removenotification/:id",
  verifyAdminToken,
  upload_userImages.none(),
  //   upload_userImages.single("notifImg"),
  notify.deleteNotification
);

// notifyAppRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = notifyAppRoute;
