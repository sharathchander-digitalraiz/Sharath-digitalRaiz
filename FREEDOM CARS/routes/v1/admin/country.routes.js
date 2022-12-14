const express = require("express");
const contRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const contry = require("../../../controller/admin/country.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
contRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Country initial route" });
});

/**************** customer self signup *************/
contRoute.post(
  "/addcountry",
  verifyAdminToken,
  upload_userImages.single("countryImg"),
  contry.addCountry
);

contRoute.post(
  "/getallcountries",
  verifyAdminToken,
  upload_userImages.none(),
  contry.getAllCountries
);

// contRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = contRoute;
