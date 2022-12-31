const adminRoute = require("../routes/adminRoutes/admin.Routes");
//const appRoute = require("../routes/appRoutes/app.Routes");

const mainRoute = require("express").Router();

mainRoute.use("/admin", adminRoute);
//mainRoute.use("/app", appRoute);

module.exports = mainRoute;