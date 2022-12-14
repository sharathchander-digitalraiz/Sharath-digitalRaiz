const customerRoute = require("express").Router();

//  Importing the auth controller
const customer = require("../../../controller/admin/cutomer.controller");

// defining the routes
/************ Plot Excel sheet bulk upload apis ************/
customerRoute.post("/addcustomerwithoutplot", customer.addCustomer);

/************ get all customers apis *********/
customerRoute.post("/getallcustomers", customer.getAllCustomers);
customerRoute.post("/add", customer.addCustomer);

module.exports = customerRoute;
