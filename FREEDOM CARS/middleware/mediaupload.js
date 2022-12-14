// import librraries
const multer = require("multer")

// middleware for uploading the user images
const userImgStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "./uploads/user");
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

  // middleware for uploading the customerDocImg
const customerDocImgStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "./uploads/customerDoc");
	},
  
	filename: (req, file, cb) => {
	  cb(null, Date.now() + "-" + file.originalname);
	}
  });
  
  const customerDocImgMaxSize = 10 * 1024 * 1024;
  exports.upload_customerDocImages = multer({
	storage: customerDocImgStorage,
	fileFilter: (req, file, cb) => {
	  if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
		cb(null, true);
	  } else {
		cb(null, false);
		return cb(new Error("This file extension is not allowed"));
	  }
	},
	limits: { fileSize: customerDocImgMaxSize }
  });
 
  // middleware for uploading the bannerImg
const bannerImgStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "./uploads/banner");
	},
  
	filename: (req, file, cb) => {
	  cb(null, Date.now() + "-" + file.originalname);
	}
  });
  
  const bannerImgMaxSize = 10 * 1024 * 1024;
  exports.upload_bannerImages = multer({
	storage: bannerImgStorage,
	fileFilter: (req, file, cb) => {
	  if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
		cb(null, true);
	  } else {
		cb(null, false);
		return cb(new Error("This file extension is not allowed"));
	  }
	},
	limits: { fileSize: bannerImgMaxSize }
  });
  
  // middleware for uploading the carModel
const carModelStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "./uploads/carModel");
	},
  
	filename: (req, file, cb) => {
	  cb(null, Date.now() + "-" + file.originalname);
	}
  });
  
  const carModelMaxSize = 10 * 1024 * 1024;
  exports.upload_carModelImages = multer({
	storage: carModelStorage,
	fileFilter: (req, file, cb) => {
	  if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
		cb(null, true);
	  } else {
		cb(null, false);
		return cb(new Error("This file extension is not allowed"));
	  }
	},
	limits: { fileSize: carModelMaxSize }
  });
  
  // middleware for uploading the car
const carStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "./uploads/car");
	},
  
	filename: (req, file, cb) => {
	  cb(null, Date.now() + "-" + file.originalname);
	}
  });
  
  const carMaxSize = 10 * 1024 * 1024;
  exports.upload_carImages = multer({
	storage: carStorage,
	fileFilter: (req, file, cb) => {
	  if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
		cb(null, true);
	  } else {
		cb(null, false);
		return cb(new Error("This file extension is not allowed"));
	  }
	},
	limits: { fileSize: carMaxSize }
  });
  
  // middleware for uploading the securityDeposite
const securityDepositeStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "./uploads/securityDeposite");
	},
  
	filename: (req, file, cb) => {
	  cb(null, Date.now() + "-" + file.originalname);
	}
  });
  
  const securityDepositeMaxSize = 10 * 1024 * 1024;
  exports.upload_securityDepositeImages = multer({
	storage: securityDepositeStorage,
	fileFilter: (req, file, cb) => {
	  if (file.originalname.match(/\.(png|PNG|jpg|jpeg)$/)) {
		cb(null, true);
	  } else {
		cb(null, false);
		return cb(new Error("This file extension is not allowed"));
	  }
	},
	limits: { fileSize: securityDepositeMaxSize }
  });