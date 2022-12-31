// import the required libraries
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");

// configuring the dotenv and cors
dotenv.config();
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

const peerServer = ExpressPeerServer(server, { debug: true });
app.use("/peerjs", peerServer);

// Calling the public folder
app.use(express.static("public"));

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/images", express.static(__dirname + "/images"));

// importing general/admin routes
const adminAuthRoutes = require("./routes/admin/userAuth");
const userCellCodeRoutes = require("./routes/admin/countryCode/countryCode");

// importing user/web the Routes
const userRoutes = require("./routes/web/userAuth");
const userMeetingRoutes = require("./routes/web/videoroom");

// adding general/admin middlewares to the application
app.use("/api", adminAuthRoutes);
app.use("/api", userCellCodeRoutes);

// adding user/web middlewares to the application
app.use("/api", userRoutes);
app.use("/api", userMeetingRoutes);

// MongoDB connection path
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_ATLAS_USERNAME}:${process.env.MONGO_DB_ATLAS_PASSWORD}@${process.env.MONGO_DB_ATLAS_DATABASE}.czk9f16.mongodb.net/?retryWrites=true&w=majority`
    // `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@localhost:27017/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(function () {
    console.log(`connected to database`);
  })
  .catch(function (er) {
    console.log(er, `Database connection error`);
  });

// app.get("/", function (req, res) {
//   res.send(
//     ` <h1> <i style="color:#4267B2"> Hello From InstaVc Team..! </i> 💻📞📱 </h1> `
//   );
// });

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId  );
    });
  });
});

app.get("/", function (req, res) {
  res.render("room");
});

io.on("connection", (socket) => {
  socket.on("newUser", (id) => {
    socket.join("/");
    socket.to("/").broadcast.emit("userJoined", id);
  });
});

server.listen(process.env.PORT, (err) => {
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
