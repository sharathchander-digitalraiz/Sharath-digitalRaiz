const express = require("express");
const termsRoute = express.Router();
const termsData = require("../../../controller/app/termsAndConitions");
const token = require("../../../middleware/tokenVerify");

/**************** customer terms router *************/
//post terms
termsRoute.post("/post-terms", token.verifyAdminToken, termsData.postAllTerms);
termsRoute.get("/termsconditions", token.verifyAdminToken, termsData.getTermsConditions);
termsRoute.get("/privacy-policy", token.verifyAdminToken, termsData.getPrivacypolicy);
termsRoute.get("/help", token.verifyAdminToken, termsData.getHelpFaq);
termsRoute.get("/refund", token.verifyAdminToken, termsData.getRefundPolicy);

module.exports = termsRoute;
