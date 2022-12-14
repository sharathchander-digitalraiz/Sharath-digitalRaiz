const reportRoute = require("express").Router();

//  Importing the auth controller
const bookingReport = require("../../../controller/admin/bookingReport.controller");
const soldoutReport = require("../../../controller/admin/soldoutBookingReport.controller");
const transactReport = require("../../../controller/admin/transactReport.controller");
const advanceBookingReport = require("../../../controller/admin/advanceBookingReport.controller");
const {
  vacantReport
} = require("../../../controller/admin/vacantReport.controller");
const plotDetailsReport = require("../../../controller/admin/plotDetailedReport.controller");
const plotCancelReport = require("../../../controller/admin/cancelPlotReport.controller");

// defining the routes

/************ individual plot apis *********/
reportRoute.post("/plotbookingreport", bookingReport.plotBookingsReport);
reportRoute.post(
  "/plotadvancepaidreport",
  advanceBookingReport.plotAdvancePaidReport
);
reportRoute.post("/plotsoldoutreport", soldoutReport.plotSoldoutReport);
reportRoute.post("/plottransactionreport", transactReport.transactionReport);
reportRoute.post("/plotdetailsreport", plotDetailsReport.plotDetailsReport);
reportRoute.post("/plotvacantReport", vacantReport);
reportRoute.post("/plotcancelReport", plotCancelReport.plotCancelReport);

module.exports = reportRoute;
