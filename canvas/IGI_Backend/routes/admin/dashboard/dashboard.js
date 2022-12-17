const express = require("express");
const router = express.Router();

// import function
const { verifyToken } = require("../../../commonMiddleWare");
const {
  getDashBoardElements,
} = require("../../../controller/admin/dashboard/dashboard");

// defining the routes
router.post("/admin/dashboard/getelemenst", verifyToken, getDashBoardElements);

module.exports = router;
