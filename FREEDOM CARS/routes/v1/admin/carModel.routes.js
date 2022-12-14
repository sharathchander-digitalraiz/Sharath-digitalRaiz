const express = require("express");
const carModelRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const carmodel = require("../../../controller/admin/carModel.controller");
const { upload_carModelImages } = require("../../../middleware/mediaupload");

// defining routes
carModelRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car Model initial route" });
});

/**************** Car model apis *************/
carModelRoute.post(
  "/addcarmodel",
  verifyAdminToken,
  upload_carModelImages.array("carmodelImg", 30),
  carmodel.addCarmodel
);

carModelRoute.post(
  "/getallcarmodels",
  verifyAdminToken,
  upload_carModelImages.none(),
  carmodel.getAllCarModels
);

carModelRoute.post(
  "/getallactivecarmodels",
  verifyAdminToken,
  upload_carModelImages.none(),
  carmodel.getAllActiveCarModels
);

carModelRoute.put(
  "/editcarmodel/:id",
  verifyAdminToken,
  upload_carModelImages.array("carmodelImg", 30),
  carmodel.editCarModel
);

carModelRoute.put(
  "/disablecarmodel/:id",
  verifyAdminToken,
  upload_carModelImages.none(),
  carmodel.disableCarModel
);

carModelRoute.post(
  "/getcarmodelbybrand",
  verifyAdminToken,
  upload_carModelImages.none(),
  carmodel.getCarModelByBrand
);

carModelRoute.post(
  "/getcarmodelbytypebrand",
  verifyAdminToken,
  upload_carModelImages.none(),
  carmodel.getCarModelByTypeAndBrand
);

// carModelRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

module.exports = carModelRoute;
