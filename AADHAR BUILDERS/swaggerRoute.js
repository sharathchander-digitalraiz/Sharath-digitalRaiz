let swaggerDocs = require("./swagger.json");
const m2s = require("mongoose-to-swagger");
// all the routes
const { authSchema } = require("./routes/v1/admin/admin.routes"); 	

// add all the models
const adminModel = require("./model/adminAuth");

// convert into swagger schema
swaggerDocs.definitions["Admin"] = m2s(adminModel);

let paths = {
  // admin routues
  ...authSchema
};
let finalSwaggerDocs = { ...swaggerDocs, paths: paths };

module.exports = finalSwaggerDocs;
