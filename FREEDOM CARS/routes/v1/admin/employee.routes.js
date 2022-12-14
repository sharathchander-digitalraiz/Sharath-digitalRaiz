const express = require("express");
const employeeRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const employe = require("../../../controller/admin/employee.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
employeeRoute.get("/", function (req, res) {
  res.status(200).json({ message: "employee initial route" });
});

employeeRoute.post(
  "/employeeregister",
  verifyAdminToken,
  upload_userImages.none(),
  employe.employeeSignup
);
employeeRoute.post(
  "/employeesignin",
  upload_userImages.none(),
  employe.employeeSignin
);

employeeRoute.post(
  "/getemployeebyid",
  verifyAdminToken,
  employe.getEmployeeById
);

employeeRoute.post(
  "/getallemployees",
  verifyAdminToken,
  employe.getAllEmployees
);

employeeRoute.post(
  "/getallactiveemployees",
  verifyAdminToken,
  employe.getAllActiveEmployees
);

// employeeRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = employeeRoute;
