// importing the required libraries..
const User = require("../model/userAuth");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin/User common signin function
exports.requireSignin = function (req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET_PASSWORD);
      req.user = user;
    } else {
      res.status(400).json({ message: "Bearer token not defined" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid Authoriztion" });
  }
  next();
};

// Admin/User common verify token
exports.verifyToken = function (req, res, next) {
  let expired = null;
  const bearerHeader = req.headers["authorization"];
  let bearerToken = "";
  if (bearerHeader) {
    bearerToken = bearerHeader.split(" ")[1];
  }

  if (bearerToken) {
    jwt.verify(
      bearerToken,
      process.env.JWT_SECRET_PASSWORD,
      function (err, decoded) {
        if (err) {
          try {
            expired = err;
            res.status(400).json({ message: "token expired", expired });
          } catch (err) {
            res.status(400).json({ message: "token expired", err });
          }
        }
        if (decoded) {
          req.userId = decoded._id;
          next();
        }
      }
    );
  } else {
    res.status(400).json({ message: "Bearer token not defined" });
  }
};

/*************Middleware to upload Images ****************/
// middleware for uploading the user images
const userImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/users");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const userImgMaxSize = 10 * 1024 * 1024;
exports.upload_userImages = multer({
  storage: userImgStorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("This file extension is not allowed"));
    }
  },
  limits: { fileSize: userImgMaxSize },
});

// middleware for uploading the summary details images
const summaryImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/summary");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const summaryImgMaxSize = 10 * 1024 * 1024;
exports.upload_summaryImages = multer({
  storage: summaryImgStorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
      cb(null, true);
    } else {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
    }
  },
  limits: { fileSize: summaryImgMaxSize },
});

/********************Middleware to upload Videos ********************/
// middleware for uploading the temple videos
const templeVdostorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/templeVideos");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const templeVdoMaxSize = 100 * 1024 * 1024;
exports.upload_templeVdo = multer({
  storage: templeVdostorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(mp4)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("This file extension is not allowed"));
    }
  },
  limits: { fileSize: templeVdoMaxSize },
});
