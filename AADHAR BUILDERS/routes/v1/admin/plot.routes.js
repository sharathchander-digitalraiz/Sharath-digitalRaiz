const plotRoute = require("express").Router();

//  Importing the auth controller
const plot = require("../../../controller/admin/plot.controller");
const customer = require("../../../controller/admin/cutomer.controller");
const PlotRegistory = require("../../../controller/admin/plotRegistory.controller");
const editPayment = require("../../../controller/admin/payment.controller");

// defining the routes
/************ Plot Excel sheet bulk upload apis ************/
plotRoute.post("/addexcelplot", plot.importPlotDetails);

/************ individual plot apis *********/
plotRoute.post("/addplot", plot.addPlot);

plotRoute.post("/getplot", plot.getPlot);

plotRoute.post("/getplotcutomrpay", plot.getPlotDetails); // get customer & payment list

plotRoute.post("/getallplots", plot.getAllPlots);

plotRoute.post("/getstagwiseplots", plot.getStagewisePlots);

plotRoute.post("/editcustomerdetails", customer.updateCustomerDetails);

plotRoute.post("/getallplotsonphase", plot.getAllPlotsOnphase);

plotRoute.put("/update-plotdetails/:id", plot.editPlotDetails);

plotRoute.put("/editplot/:id", plot.editPlot);

plotRoute.post("/freeplotforsale/:id", plot.freePlotForSale);

plotRoute.delete("/removeplot/:id", plot.removePlot);

plotRoute.post("/plot-getallcancelcheque", plot.getAllCheckPay);

plotRoute.post("/plot-cancelcheque/:id/:checkNum", plot.cancelCheque);

/**************** Plot registory apis *************/
plotRoute.post("/add-plotregistory", PlotRegistory.addPlotRegistory);

plotRoute.post("/getall-plotregistory", PlotRegistory.getAllPlotRegistories);

plotRoute.put(
  "/edit-plotregistory/:plotId",
  PlotRegistory.updatePlotRegistoryStatus
);

/***************** payment apis *******************/
plotRoute.put("/editpaymentdetails/:id", editPayment.editPayment);

/******************** deleteAllBulkData **************/
plotRoute.post("/deleteallbulkdata", PlotRegistory.deleteAllBulkData);

/************ Project name apis **************/
plotRoute.post("/getprojectname", plot.getProjectName);

module.exports = plotRoute;
