const express = require("express");
const faviouritesAppRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const faviourites = require("../../../controller/app/faviourites.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
faviouritesAppRoute.get("/", function (req, res) {
  res.status(200).json({ message: "faviourites initial App route" });
});

/**************** customer self signup *************/
faviouritesAppRoute.post(
  "/addfaviourites",
  verifyAdminToken,
  upload_userImages.none(),
  faviourites.addFavourites
);
faviouritesAppRoute.post(
  "/getFavourites",
  verifyAdminToken,
  upload_userImages.none(),
  faviourites.getFavourites
);

// notifyAppRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = faviouritesAppRoute;
