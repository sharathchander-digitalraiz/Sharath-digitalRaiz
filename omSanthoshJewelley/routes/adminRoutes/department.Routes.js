const express = require("express");
const deptRoutes = express.Router();
const cors = require("cors");

const deptController = require("../../controllers/admin/department.controller");

deptRoutes.post("/adddepartment",deptController.addDepartment)


module.exports = deptRoutes;