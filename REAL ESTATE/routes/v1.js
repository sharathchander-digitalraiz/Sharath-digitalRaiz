const adminRoute = require("./v1/admin/admin.routes");

// const { sendEmailVerify, senderGridmail } = require("../helper/mail");

const v1Route = require("express").Router();

v1Route.get("/", (req, res) => {
  res.status(200).json({ message: "v1 routes working" });
});

v1Route.use("/admin", adminRoute);

module.exports = v1Route;
