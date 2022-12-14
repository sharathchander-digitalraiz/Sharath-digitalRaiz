const express = require("express");
const mongoose = require("mongoose");
//const swaggerUI = require("swagger-ui-express");
//const swaggerDocs = require("./swagger.json");
const app = express();
const { registerSchema } = require("./routes/v1/admin/auth.routes");
// const finalSwaggerDocs = require("./swaggerRoute");
var path = require("path");
var multer = require("multer");
var upload = multer();
const cors = require("cors");
require("dotenv").config();

// set template engine
app.set("views", "./views");

// combining and importing all the routes
const v1Route = require("./routes/v1");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add cors to project
app.use(cors());

// defining folder for uploading the files/images/documents
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

 // process.env.MONGODB_ATLAS_CONNECTION_STRING
mongoose
  .connect( 
    `mongodb+srv://sharath:sharath@cluster0.rzhaq3e.mongodb.net/test`
  )
  .then(function () {
    console.log(`Connected to database`);
  })
  .catch(function (er) {
    console.log(`Database connection error`, er.message);
  });

app.get("/", (_req, res) => {
  res
    .status(200)
    .send(
      ` <h1> <i style="color:#f9184e"> Welcome to realstate </i> 🏡🏨🏗🤝🏼💰 </h1> `
    );
});
app.use("/v1", v1Route);

//add swagger path to swagger Docs
// app.use(
//   "/api-docs",
//   swaggerUI.serve,
//   swaggerUI.setup(finalSwaggerDocs, { explorer: true })
// );

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`http://127.0.0.1:${process.env.PORT}`);
  }
});
