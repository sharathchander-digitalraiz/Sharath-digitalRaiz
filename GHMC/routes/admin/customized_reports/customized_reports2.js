const express = require("express");

/* SIGN IN Require */
const { requireSignin } = require("../../../common-middleware/index");

/*Admin Dashboard */
const {upload} = require("../../../controllers/dashboard/dashboard_api");

/*************************************************************************
 * ************************Customized Manhole Report************************
 * ************************************************************************/

const {manholeResport}=require("../../../controllers/admin/customized_reports/manholeReport");

var router = express.Router();
exports.routes = function (app) {
  /* Dashboard */
  app.post("/admin/customizedreport/zonewise/manholeReport",requireSignin,upload.none(),manholeResport);
 
};