const express = require("express");
const router = express.Router();

// importing functions
const { verifyToken } = require("../../../commonMiddleWare");
const {
  addCountryCode,
  getAllCountryCodes,
  editCountryCode,
  removeCountryCode,
  getAllCountryCodesStatus
} = require("../../../controller/admin/countryCode/countryCode");

// defining routes
router.post("/admin/country/add-countrycode", verifyToken, addCountryCode);
router.post(
  "/admin/country/getall-countrycode",
  verifyToken,
  getAllCountryCodes
);
router.put("/admin/country/edit-countrycode/:id", verifyToken, editCountryCode);
router.delete(
  "/admin/country/remove-countrycode/:id",
  verifyToken,
  removeCountryCode
);

/**************** user side apis ***************/
router.get("/web/country/getactive-countrycode", getAllCountryCodesStatus);

module.exports = router;
