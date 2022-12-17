const express = require("express");
const router = express.Router();

// importing the required functions
const {
  verifyToken,
  upload_summaryImages,
} = require("../../../commonMiddleWare");
const {
  addSummaryDetails,
  getSummaryDetails,
  getAllSummaryList,
  editSummary,
  removeSummary,
  a4sizeshhet,
} = require("../../../controller/admin/summaryDetail/summaryDetail");
const {
  validataddSummary,
  isRequestvalidataddSummary,
} = require("../../../validator/summaryDetail");

// defining the routes
router.post(
  "/admin/igiindia/addSummary",
  verifyToken,
  upload_summaryImages.single("summaryImg"),
  validataddSummary,
  isRequestvalidataddSummary,
  (req, res, next) => {
    if (!req.file) {
      res.json({
        success: false,
        message: "Image not selected or forbidden extension!",
      });
    }
    next();
  },
  addSummaryDetails
);

// router.post(
//   "/admin/igiindia/addidentificationreport",
//   verifyToken,
//   upload_summaryImages.single("summaryImg"),
//   addIdentificationReport
// );

router.post("/admin/igiindia/getSummary", verifyToken, getSummaryDetails);

router.get("/admin/igiindia/getallSummary", verifyToken, getAllSummaryList);

router.post("/a4sizeshhet", a4sizeshhet);

router.put(
  "/admin/igiindia/editsummary/:id",
  verifyToken,
  upload_summaryImages.single("summaryImg"),
  editSummary
);

router.delete("/admin/igiindia/removesummary/:id", verifyToken, removeSummary);

module.exports = router;
