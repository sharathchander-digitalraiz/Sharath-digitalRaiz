// import the required libraries
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// configuring the dotenv and cors
dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/images", express.static(__dirname + "/images"));

// importing general/Admin the Routes
const adminRoutes = require("./routes/admin/userAuth");
const adminProfileRoutes = require("./routes/admin/profile/profile");
const adminSummaryRoutes = require("./routes/admin/summaryDetail/summaryDetail");
const adminUsersRoutes = require("./routes/admin/adminUser/adminUser");
const adminDashboardRoutes = require("./routes/admin/dashboard/dashboard");

// importing Web/User the Routes
const userSummaryRoutes = require("./routes/web/summaryDetail/summaryDetail");

// importing the app Routes
// const appAuthRoutes = require("./routes/app/userAuth");

// adding general/admin middlewares to the application
app.use("/api", adminRoutes);
app.use("/api", adminProfileRoutes);
app.use("/api", adminSummaryRoutes);
app.use("/api", adminUsersRoutes);
app.use("/api", adminDashboardRoutes);

// adding Web/User middlewares to the application
app.use("/api", userSummaryRoutes);

// adding app middlewares to the application
// app.use("/api", appAuthRoutes);

// MongoDB connection path
// mongodb://JSRDATABASE2022:<password>@jsr0-shard-00-00.g4nox.mongodb.net:27017,jsr0-shard-00-01.g4nox.mongodb.net:27017,jsr0-shard-00-02.g4nox.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-lu1d70-shard-0&authSource=admin&retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_ATLAS_USERNAME}:${process.env.MONGO_DB_ATLAS_PASSWORD}@jsr0.g4nox.mongodb.net/${process.env.MONGO_DB_ATLAS_DATABASE}?retryWrites=true&w=majority`
    //  `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@localhost:27017/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(function () {
    console.log(`connected to database`);
  })
  .catch(function (er) {
    console.log(er, `Database connection error`);
  });

app.get("/", function (req, res) {
  res.send(
    ` <h1> <i style="color:#f1b10e"> Hello From IGI India..! </i> 💍💎 </h1> `
  );
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listning on port ${process.env.PORT}`);
  }
});

// const items = ['réservé', 'premier', 'communiqué', 'café', 'adieu', 'éclair'] ; // with accents, lowercase

// items. sort(function (a, b) {
//   return a.localeCompare(b)
// });

// console.log(items)
