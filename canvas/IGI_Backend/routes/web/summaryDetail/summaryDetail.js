const express = require("express");
const router = express.Router();

// importing functions
const {
  getUserSummaryDetails,getStringUserSummaryDetails
} = require("../../../controller/admin/summaryDetail/summaryDetail");

// defining the routes
router.post("/user/summarydetails/getdetails", getUserSummaryDetails);
router.post("/user/summarydetails/getStringUserSummaryDetails", getStringUserSummaryDetails);

module.exports = router;
