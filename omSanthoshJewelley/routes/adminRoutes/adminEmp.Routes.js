const express = require("express");
const adminEmpRoutes = express.Router();
const cors = require("cors");

const adminEmpController = require("../../controllers/admin/adminEmp.controller");
const verifyToken = require("../../middlewares/verifyToken")

adminEmpRoutes.post("/registerAdmin", verifyToken.verifyAdminToken, adminEmpController.adminEmpRegister)
adminEmpRoutes.post("/login",adminEmpController.adminEmpLogin)


module.exports = adminEmpRoutes;