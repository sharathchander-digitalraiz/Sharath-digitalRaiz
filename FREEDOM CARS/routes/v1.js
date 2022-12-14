const adminRoute = require("./v1/admin/admin.routes");
const superAuthRoute = require("./v1/admin/superadmin.routes");
const appRoute = require("./v1/app/appMain.routes");

// const { sendEmailVerify, senderGridmail } = require("../helper/mail");

const v1Route = require("express").Router();

v1Route.get("/", (req, res) => {
  res.status(200).json({ message: "v1 routes working" });
});

v1Route.use("/superadmin", superAuthRoute);
v1Route.use("/admin", adminRoute);
v1Route.use("/app", appRoute);



module.exports = v1Route;
