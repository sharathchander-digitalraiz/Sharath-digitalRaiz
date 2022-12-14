const express = require("express");
const deptRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const dept = require("../../../controller/admin/department.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

// defining routes
deptRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Branch initial route" });
});

deptRoute.post(
  "/add-department",
  verifyAdminToken,
  upload_userImages.none(),
  dept.addDepartment
);
deptRoute.post("/get-departmentbyid", verifyAdminToken, dept.getDepartmentById);
deptRoute.post("/getall-departments", verifyAdminToken, dept.getAllDepartments);
deptRoute.post("/getall-activedepartments", dept.getAllDepartments);

// deptRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = deptRoute;
