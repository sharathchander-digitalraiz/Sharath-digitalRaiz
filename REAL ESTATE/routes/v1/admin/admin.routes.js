const express = require("express");
const adminRoute = express.Router();
const cors = require("cors");


// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const { authRoute, ProfileRoute } = require("./auth.routes");
const {
  upload_excelDocuments
} = require("../../../controller/admin/plot.controller");
const plotRoute = require("./plot.routes");
const dashboardRoute = require("./dashboard.routes");
const reportRoute = require("./reports.routes");
const customerRoute = require("./customer.routes");

// defining routes
adminRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Admin initial route" });
});

adminRoute.use("/auth", authRoute);

adminRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

adminRoute.use("/dashbord", verifyAdminToken, cors(), dashboardRoute);

adminRoute.use("/reports", verifyAdminToken, cors(), reportRoute);

// plot excel routes
adminRoute.use(
  "/plotexcel",
  verifyAdminToken,
  upload_excelDocuments.single("plotsheet"),
  cors(),
  plotRoute
);

// customer excel routes
adminRoute.use("/customer", verifyAdminToken, customerRoute);

module.exports = adminRoute;
