// add libraries
const bcrypt = require("bcrypt");

const Auth = require("../../service/admin/auth.service");
const multer = require("multer");
const adminModel = require("../../model/adminAuth");
const operationModel = require("../../model/operation");

const auth = new Auth();

exports.register = async (req, res, next) => {
  try {
    const user = await adminModel.findOne(
      { email: req.body.email },
      { _id: 1, email: 1, phone: 1, role: 1, password: 1 }
    );
    if (user) {
      console.log("user");
      res.status(400).json({ message: "User already registered" });
    } else {
      console.log(req.body);
      await auth.register(req.body);
      res.status(200).json({ message: "success" });
    }
    //req.body.adminRights = [1]
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    let token = await auth.login(req.body.email, req.body.password);
    // console.log(token);
    let data = {};
    data.token = token.token;
    data._id = token.user._id;
    data.email = token.user.email;
    data.phone = token.user.phone;
    data.role = token.user.role;
    data.profileImage = token.user.profileImage;

    // console.log(token.iat);
    let ip = req.socket.remoteAddress;
    let opereshan = await auth.loginOps(data._id, ip);
    res.status(200).json({ message: "success", data });
  } catch (err) {
    res.status(400).json({ message: err.message, error: err.error });
  }
};

exports.updateLogout = async (req, res, next) => {
  try {
    let token = await auth.updatesignout(req.body.email, req.body.password);
    console.log(token);
    let data = {};
    data.token = token.token;
    data._id = token.user._id;
    data.email = token.user.email;
    data.phone = token.user.phone;
    data.role = token.user.role;
    data.profileImage = token.user.profileImage;
    res.status(200).json({ message: "success", data });
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error });
  }
};

exports.adminprofile = async (req, res, next) => {
  try {
    let result = await auth.adminprofile(req.body._id);
    let mySocket = req.socket.remoteAddress;
    let myip = mySocket.slice(7, 22);

    // console.log(mySocket);
    res.status(200).json({ message: "success", result });
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error });
  }
};

exports.adminProfileUpdate = async (req, res, next) => {
  try {
    let result = await auth.updateProfile(req.body, req.userId);
    if (result) {
      res.status(200).json({ message: "success" });
    }
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error });
  }
};

exports.uploadProfileImg = async (req, res, next) => {
  try {
    // if (req.file.length == 0) {
    //   return res.status(400).json({ message: "Image cannot be empty" });
    // }
    let profileimage = req.file.path;
    await auth.uploadProfileImg(req.userId, profileimage);
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message, error: err.error });
  }
};

// exports.change_pasword = async (req, res, next) => {
//   try {
//     let email_found = await auth.change_pasword(req.body.email);
//     res.status(200).json({ message: "success" });
//   } catch (err) {
//     res.status(err.status).json({ message: err.message, error: err.error });
//   }
// };

exports.update_password = async (req, res, next) => {
  try {
    // console.log(req.body);
    const password = req.body.old_password;
    const newpassword = req.body.new_password;
    const confirmpassword = req.body.confirm_password;

    console.log(req.userId);
    await auth.update_password(
      password,
      newpassword,
      confirmpassword,
      req.userId
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(err.status).json({ message: err.message, error: err.error });
  }
};

exports.removeEmployeFromList = async function (req, res) {
  // try {
  const showUser = await adminModel
    .findOne({ _id: req.params.id }, { role: 1 })
    .sort({ createdAt: 1 });

  console.log(showUser);

  if (showUser.role == "superadmin") {
    return res.status(400).json({
      message: "This is admin profile please select different profile"
    });
  } else {
    const removeResult = await adminModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isDelete: true
        }
      },
      { new: true }
    );

    if (removeResult) {
      res.status(200).json({ message: "Success" });
    }
  }
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

exports.getAllEmployees = async function (req, res) {
  try {
    const showUser = await adminModel.findById(
      { _id: req.userId },
      { role: 1 }
    );

    console.log(showUser);

    if (showUser.role == "superadmin" || showUser.role == "admin") {
      const employeResult = await adminModel
        .find({ isDelete: false })
        .sort({ createdAt: -1 });

      res.status(200).json({ message: "Success", employeResult });
    } else {
      return res.status(400).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

exports.updateEmployee = async function (req, res) {
  try {
    const changeStatus = await adminModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          // password: bcrypt.hashSync(req.body.password, 10),
          phone: req.body.phone,
          address: req.body.address,
          role: req.body.role,
          status: req.body.status
        }
      },
      { new: true }
    );

    if (changeStatus) {
      res.status(200).json({ message: "Employee status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all employee login history
exports.getAllEmployeesLoginHistory = async function (req, res) {
  try {
    const showRole = await adminModel.findOne(
      { _id: req.userId },
      { _id: 1, role: 1 }
    );

    if (showRole.role == "superadmin" || showRole.role == "admin") {
      const logHistory = await operationModel.find().sort({ createdAt: -1 });

      res.status(200).json({ message: "Success", logHistory });
    } else {
      res.status(400).json({ message: "Please login with admin profile" });
    }
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// remove log history
exports.removeLoghistory = async function (req, res) {
  try {
    const removelogResult = await operationModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removelogResult) {
      res.status(200).json({ message: "History cleared successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// middleware for uploading the user images
const userImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/users");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
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
  limits: { fileSize: userImgMaxSize }
});
