const express = require("express");
const adminRoute = express.Router();
const cors = require("cors");

//importing the routes
const adminEmpRoutes = require("./adminEmp.Routes");
const deptRoutes = require("./department.Routes");


/***************** Admin Employees API ******************/
adminRoute.use("/adminEmp", adminEmpRoutes);

/***************** Department API ******************/
adminRoute.use("/department", deptRoutes);

module.exports = adminRoute;
