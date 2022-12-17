const express = require("express");

/* SIGN IN Require */
const { requireSignin } = require("../../../common-middleware/index");

/*Admin Dashboard */
const {upload} = require("../../../controllers/dashboard/dashboard_api");

/*************************************************************************
 * ************************Customized Manhole Report************************
 * ************************************************************************/

const {manholeResport, manholeWardWiseReport}=require("../../../controllers/admin/customized_reports/manholeReport");

const {openPlaceResport, openPlaceWardWiseReport} = require("../../../controllers/admin/customized_reports/openPlaceReport");
const {parkingResport, parkingWardWiseReport} = require("../../../controllers/admin/customized_reports/parkingReport");
const {complexBuildingResport, complexBuildingWardWiseReport} = require("../../../controllers/admin/customized_reports/complexBuildingReport");
const {residHouseResport, residentialHouseWardWiseReport} = require("../../../controllers/admin/customized_reports/residentialHouseReport");
const {communityHallResport, communityHallWardWiseReport} = require("../../../controllers/admin/customized_reports/communityHall");
//const { vehicleResport } = require("../../../controllers/admin/customized_reports/vehicleReport");
//const { gvpBepResport } = require("../../../controllers/admin/customized_reports/gvpBepReport");

const { streetVendorResport, streetVendorWardWiseReport } = require("../../../controllers/admin/customized_reports/streetVendorReport");
const { toiletResport, toiletWardWiseReport } = require("../../../controllers/admin/customized_reports/toiletReport");
const { templeResport, templeWardWiseReport } = require("../../../controllers/admin/customized_reports/templeReport");

var router = express.Router();
exports.routes = function (app) {
  /* Dashboard */
  app.post("/admin/customizedreport/zonewise/manholeReport",requireSignin,upload.none(),manholeResport);
  app.post("/admin/customizedreport/zonewise/openplacereport", requireSignin, upload.none(), openPlaceResport);
  app.post("/admin/customizedreport/zonewise/parkingreport", requireSignin, upload.none(), parkingResport);
  app.post("/admin/customizedreport/zonewise/complexbuildingreport", requireSignin, upload.none(), complexBuildingResport);
  app.post("/admin/customizedreport/zonewise/residhousereport", requireSignin, upload.none(), residHouseResport);
  app.post("/admin/customizedreport/zonewise/communityhallreport", requireSignin, upload.none(), communityHallResport);

  app.post("/admin/customizedreport/zonewise/streetvendorreport", requireSignin, upload.none(), streetVendorResport);
  app.post("/admin/customizedreport/zonewise/toiletreport", requireSignin, upload.none(), toiletResport);
  app.post("/admin/customizedreport/zonewise/templereport", requireSignin, upload.none(), templeResport);

  /* ward waise customized reports */
  app.post("/admin/customizedreport/wardwise/manholeReport",requireSignin,upload.none(),manholeWardWiseReport);
  app.post("/admin/customizedreport/wardwise/openplacereport", requireSignin, upload.none(), openPlaceWardWiseReport);
  app.post("/admin/customizedreport/wardwise/parkingreport", requireSignin, upload.none(), parkingWardWiseReport);
  app.post("/admin/customizedreport/wardwise/complexbuildingreport", requireSignin, upload.none(), complexBuildingWardWiseReport);
  app.post("/admin/customizedreport/wardwise/residhousereport", requireSignin, upload.none(), residentialHouseWardWiseReport);
  app.post("/admin/customizedreport/wardwise/communityhallreport", requireSignin, upload.none(), communityHallWardWiseReport);

  app.post("/admin/customizedreport/wardwise/streetvendorreport", requireSignin, upload.none(), streetVendorWardWiseReport);
  app.post("/admin/customizedreport/wardwise/toiletreport", requireSignin, upload.none(), toiletWardWiseReport);
  app.post("/admin/customizedreport/wardwise/templereport", requireSignin, upload.none(), templeWardWiseReport);


//   app.post("/admin/customizedreport/zonewise/vehiclereport", requireSignin, upload.none(), vehicleResport);
//   app.post("/admin/customizedreport/zonewise/gvpBepreport", requireSignin, upload.none(), gvpBepResport);
 
};