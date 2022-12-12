const dashboardRoute = require("express").Router();

//  Importing the auth controller
const dashboard = require("../../../controller/admin/dashboard.controller");

// defining the routes

/************ dashboard apis *********/
dashboardRoute.post("/getdashborditems", dashboard.getDashboardItems);

module.exports = dashboardRoute;
