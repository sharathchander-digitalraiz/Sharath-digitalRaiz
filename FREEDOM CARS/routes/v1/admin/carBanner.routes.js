const express = require("express");
const carBannerRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const carBanner = require("../../../controller/admin/carBanner.controller");
const { upload_bannerImages } = require("../../../middleware/mediaupload");

// defining routes
carBannerRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car Banner initial route" });
});

/**************** car brand apis *************/
carBannerRoute.post(
  "/addcarbanner",
  verifyAdminToken,
  upload_bannerImages.single("bannerImg"),
  carBanner.addCarBanner
);

carBannerRoute.post(
  "/getallcarbanners",
  verifyAdminToken,
  upload_bannerImages.none(),
  carBanner.getAllBanners
);

carBannerRoute.post(
  "/getallactivecarbanners",
  verifyAdminToken,
  upload_bannerImages.none(),
  carBanner.getAllActiveBanners
);

// carBannerRoute.post(
//   "/getallactivecarbrands",
//   verifyAdminToken,
//   upload_userImages.none(),
//   brand.getAllActiveCarBrand
// );

carBannerRoute.put(
  "/editbanner/:id",
  verifyAdminToken,
  upload_bannerImages.single("bannerImg"),
  carBanner.editBnner
);

carBannerRoute.delete(
  "/removebanner/:id",
  verifyAdminToken,
  carBanner.removeBanner
);

// carBannerRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = carBannerRoute;
