const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "photoUploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//multer to post/put through form (images/files)
exports.uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(png|PNG|JPG|jpg|jpeg|JPEG)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("This file extension is not allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});
