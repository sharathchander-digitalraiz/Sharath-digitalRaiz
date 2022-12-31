require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 6205;
const cors = require("cors");
const mainRoute = require("./routes/mainRoute");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/omsanthoshjewellery", mainRoute);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(`<center><h1>ॐ ॥Welcome to the Om Santhosh Jewellery॥</h1></center>`);
});

//connecting to database
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wqmri3u.mongodb.net/omsanthosh`
  )
  .then(() => {
    console.log("The database was successfully connected.");
  })
  .catch(() => {
    console.log("Sorry, the database was not found!");
  });

app.listen(port, () => {
  console.log(`The server is on http://127.0.0.1:${port}`);
});
