const express = require("express");
const carRoute = express.Router();
const cors = require("cors");

// importing functions
const { verifyAdminToken } = require("../../../middleware/tokenVerify");
const car = require("../../../controller/admin/car.controller");
const {
  upload_userImages,
  upload_carImages
} = require("../../../middleware/mediaupload");

// defining routes
carRoute.get("/", function (req, res) {
  res.status(200).json({ message: "Car Model initial route" });
});

/**************** car brand apis *************/
carRoute.post(
  "/addcarmodel",
  verifyAdminToken,
  upload_carImages.fields([
    {
      name: "carImages",
      maxCount: 10
    },
    {
      name: "carRegisterImages",
      maxCount: 10
    }
  ]),
  car.addCar
);

carRoute.post(
  "/getcarmodel",
  verifyAdminToken,
  upload_userImages.none(),
  car.getCar
);

carRoute.post(
  "/getallcarmodel",
  verifyAdminToken,
  upload_userImages.none(),
  car.getAllCars
);

// carRoute.post(
//   "/getallactivecars",
//   verifyAdminToken,
//   upload_userImages.none(),
//   brand.getAllActiveCarBrand
// );

carRoute.put(
  "/editcar/:id",
  verifyAdminToken,
  upload_carImages.fields([
    {
      name: "carImages",
      maxCount: 10
    },
    {
      name: "carRegisterImages",
      maxCount: 10
    }
  ]),
  car.editCar
);

carRoute.patch(
  "/disablecar/:id",
  verifyAdminToken,
  upload_userImages.none(),
  car.disableCar
);

carRoute.patch(
  "/updatecarstatus/:id",
  verifyAdminToken,
  upload_userImages.none(),
  car.carActiveInactive
);

carRoute.patch(
  "/enablecar/:id",
  verifyAdminToken,
  upload_userImages.none(),
  car.enableCar
);

carRoute.post(
  "/getallcarsbymodelid",
  verifyAdminToken,
  upload_userImages.none(),
  car.getAllCarsByModelId
);

// carRoute.use("/profile", verifyAdminToken, cors(), ProfileRoute);

/***************** add car to popular or featured ***********/
carRoute.put(
  "/updatecartopopular/:id",
  verifyAdminToken,
  upload_userImages.none(),
  car.carAsPopular
);
carRoute.put(
  "/updatecartofeatured/:id",
  verifyAdminToken,
  upload_userImages.none(),
  car.carAsFeatured
);

module.exports = carRoute;
