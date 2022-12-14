const carBrandModel = require("../../model/carBrand");
const carModel = require("../../model/car");
const carTypeModel = require("../../model/carModel");
const carFeatureModel = require("../../model/feature");
const carSpecModel = require("../../model/carSpecs");
const carpriceModel = require("../../model/carprice");
const carVersionModel = require("../../model/carVersion");

// add state
exports.addCar = async function (req, res) {
  //try {
  // carModel.findOne({ title: req.body.title }).exec(async function (er, caar) {
  //   if (caar) {
  //     return res.status(200).json({ message: "Car model already exist!" });
  //   } else {
  let imagesArray = [];
  const uploadFiles = req.files.carImages; //!= [] ? req.files : []
  uploadFiles.map((item) => {
    imagesArray.push(item.path);
  });

  let regImgArr = [];
  const uploadRegImgFiles = req.files.carRegisterImages;
  uploadRegImgFiles.map((item) => {
    regImgArr.push(item.path);
  });

  const company = await carBrandModel.findOne(
    { _id: req.body.carBrandId },
    { title: 1 }
  );
  const modeltype = await carTypeModel.findOne(
    { _id: req.body.carModelId },
    { carImage: 1, model_name: 1 }
  );
  const featureType = await carFeatureModel.find(
    { _id: req.body.carFeatureId },
    { featureName: 1 }
  );

  let allFeatures = featureType.map((val) => {
    return val.featureName;
  });
  const specType = await carSpecModel.findOne(
    { _id: req.body.carSpecId },
    { specName: 1 }
  );

  const version = await carVersionModel.findOne(
    { _id: req.body.versionId },
    { carVersion: 1 }
  );
  // console.log(req.files);
  let logDate = new Date().toISOString();

  const carObj = new carModel({
    carType: req.body.carType,
    carImage: imagesArray,
    carRegisterImage: regImgArr,
    vehicleType: req.body.vehicleType,
    carBrandId: req.body.carBrandId,
    carBrandName: company.title,
    carModelId: req.body.carModelId,
    carModelName: modeltype.model_name,
    carMakeYearId: req.body.carMakeYearId,
    carMakeYear: version.carVersion,
    carRegistNumber: req.body.carRegistNumber,
    carColorAvailble: req.body.carColorAvailble,
    carFeatureId: req.body.carFeatureId,
    carFeatures: allFeatures,
    carSpecId: req.body.carSpecId,
    carSpecs: specType.specName,
    carBootCapacity: req.body.carBootCapacity,
    createdBy: req.userId,
    logDateCreated: logDate,
    logDateModified: logDate
  });

  carObj.save(async function (eror, data) {
    if (eror) {
      return res
        .status(400)
        .json({ message: "Car details could not be added", Error: eror });
    }
    if (data) {
      let priceArr = JSON.parse(req.body.priceArr);
      console.log(priceArr);
      let carPrices = priceArr.map((val) => {
        let obj;
        if (val.kms == "0" || val.kms == null || val.kms == undefined) {
          console.log("No Document");
        } else {
          obj = {
            carId: data._id,
            kms: val.kms ? val.kms : "0",
            sixHoursprice: val.sixHoursprice ? val.sixHoursprice : "0",
            tweleveHoursprice: val.tweleveHoursprice
              ? val.tweleveHoursprice
              : "0",
            onedayPrice: val.onedayPrice ? val.onedayPrice : "0"
          };
        }
        return obj;
      });
      const priceObj = await carpriceModel.insertMany(carPrices);

      // priceObj.save();
      res.status(200).json({ message: "Car added successfully" });
    }
  });
  // }
  // });
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// // get Car
exports.getCar = async function (req, res) {
  try {
    const showCar = await carModel.findById(
      { _id: req.body._id },
      {
        carType: 1,
        carImage: 1,
        carRegisterImage: 1,
        vehicleType: 1,
        carBrandId: 1,
        carBrandName: 1,
        carModelId: 1,
        carModelName: 1,
        carMakeYear: 1,
        carRegistNumber: 1,
        carColorAvailble: 1,
        carFeatureId: 1,
        carFeatures: 1,
        carSpecId: 1,
        carSpecs: 1,
        carBootCapacity: 1,
        createdBy: 1,
        logDateCreated: 1,
        logDateModified: 1,
        isPopular: 1,
        isFeatured: 1,
        isFavorite: 1,
        isActive: 1
      }
    );

    const showCarPrice = await carpriceModel.find(
      { carId: req.body._id },
      { kms: 1, sixHoursprice: 1, tweleveHoursprice: 1, onedayPrice: 1 }
    );

    let carResult = {
      _id: showCar._id,
      carType: showCar.carType,
      carImage: showCar.carImage,
      carRegisterImage: showCar.carRegisterImage,
      vehicleType: showCar.vehicleType,
      carBrandId: showCar.carBrandId,
      carBrandName: showCar.carBrandName,
      carModelId: showCar.carModelId,
      carModelName: showCar.carModelName,
      carMakeYear: showCar.carMakeYear,
      carRegistNumber: showCar.carRegistNumber,
      carColorAvailble: showCar.carColorAvailble,
      carFeatureId: showCar.carFeatureId,
      carFeatures: showCar.carFeatures,
      carSpecId: showCar.carSpecId,
      carSpecs: showCar.carSpecs,
      carBootCapacity: showCar.carBootCapacity,
      createdBy: showCar.createdBy,
      logDateCreated: showCar.logDateCreated,
      logDateModified: showCar.logDateModified,
      isPopular: showCar.isPopular,
      isFeatured: showCar.isFeatured,
      isFavorite: showCar.isFavorite,
      isActive: showCar.isActive,
      carPrices: showCarPrice
    };

    res.status(200).json({ message: "Success", carResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// // get all states
exports.getAllCars = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const carsResult = await carModel
      .find({
        $or: [
          { carBrandName: searchCodtion },
          { carModelName: searchCodtion },
          { carMakeYear: searchCodtion }
        ]
      })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", carsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// // get all active states
exports.getAllActiveCars = async function (req, res) {
  try {
    const activeCarResult = await carModel
      .find({ isActive: true })
      .sort({ title: 1 });

    res.status(200).json({ message: "Success", activeCarResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit car
exports.editCar = async function (req, res) {
  // try {
  console.log(req.files);
  let imagesArray = [];
  const uploadFiles = req.files.carImages ? req.files.carImages : []; //!= [] ? req.files : []
  uploadFiles.map((item) => {
    imagesArray.push(item.path);
  });

  let regImgArr = [];
  const uploadRegImgFiles = req.files.carRegisterImages
    ? req.files.carRegisterImages
    : [];
  uploadRegImgFiles.map((item) => {
    regImgArr.push(item.path);
  });

  const company = await carBrandModel.findOne(
    { _id: req.body.carBrandId },
    { title: 1 }
  );
  const modeltype = await carTypeModel.findOne(
    { _id: req.body.carModelId },
    { carImage: 1, model_name: 1 }
  );
  const featureType = await carFeatureModel.find(
    { _id: req.body.carFeatureId },
    { featureName: 1 }
  );

  let allFeatures = featureType.map((val) => {
    return val.featureName;
  });
  const specType = await carSpecModel.findOne(
    { _id: req.body.carSpecId },
    { specName: 1 }
  );

  const version = await carVersionModel.findOne(
    { _id: req.body.versionId },
    { carVersion: 1 }
  );

  let logDate = new Date().toISOString();

  const changeCar = await carModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        carType: req.body.carType,
        carImage: uploadFiles.length > 0 ? imagesArray : console.log("No Img"),
        carRegisterImage:
          uploadRegImgFiles.length > 0 ? regImgArr : console.log("No Img"),
        vehicleType: req.body.vehicleType,
        carBrandId: req.body.carBrandId,
        carBrandName: company.title,
        carModelId: req.body.carModelId,
        carModelName: modeltype.model_name,
        carMakeYearId: req.body.carMakeYearId,
        carMakeYear: version.carVersion,
        carRegistNumber: req.body.carRegistNumber,
        carColorAvailble: req.body.carColorAvailble,
        carFeatureId: req.body.carFeatureId,
        carFeatures: allFeatures,
        carSpecId: req.body.carSpecId,
        carSpecs: specType.specName,
        carBootCapacity: req.body.carBootCapacity,
        isActive: req.body.isActive,
        logDateModified: logDate
      }
    },
    { new: true }
  );

  // const carsIds = await carpriceModel.find(
  //   { carId: req.params.id },
  //   { _id: 1 }
  // );

  // let carPriceIds = carsIds.map((d) => {
  //   return d._id;
  // });

  // console.log(carPriceIds);

  let priceArr = JSON.parse(req.body.priceArr);
  console.log(priceArr);
  // await Promise.all(

  priceArr.map(async (val) => {
    let obj = {};
    let newobj = {};
    if (val.kms == "0") {
      console.log("No Document");
    } else {
      obj.kms = val.kms;
      obj.sixHoursprice = val.sixHoursprice;
      obj.tweleveHoursprice = val.tweleveHoursprice;
      obj.onedayPrice = val.onedayPrice;

      newobj.carId = req.params.id;
      newobj.kms = val.kms;
      newobj.sixHoursprice = val.sixHoursprice;
      newobj.tweleveHoursprice = val.tweleveHoursprice;
      newobj.onedayPrice = val.onedayPrice;
    }

    carpriceModel
      .findOne({ _id: val._id, carId: req.params.id })
      .exec(async function (erer, carr) {
        if (carr) {
          await carpriceModel.updateOne(
            { _id: val._id, carId: req.params.id },
            {
              $set: obj
            },
            { new: true }
          );
        } else {
          const list = new carpriceModel(newobj);

          await list.save();
        }

        // const changePrice = await carpriceModel.findOneAndUpdate(
        //   { _id: val._id },
        //   obj
        // );
      });

    // );
  });
  if (changeCar) {
    res.status(200).json({ message: "Car details updated successfully" });
  }

  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// remove car or disable car
exports.disableCar = async function (req, res) {
  try {
    const disableResult = await carModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isActive: false
        }
      },
      { new: true }
    );

    if (disableResult) {
      res.status(200).json({ message: "Car unlisted successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove car or disable car
exports.carActiveInactive = async function (req, res) {
  try {
    const disableResult = await carModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isActive: req.body.isActive
        }
      },
      { new: true }
    );

    if (disableResult) {
      res.status(200).json({ message: "Car status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove car or enable car
exports.enableCar = async function (req, res) {
  try {
    const enableResult = await carModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isActive: true
        }
      },
      { new: true }
    );

    if (enableResult) {
      res.status(200).json({ message: "Car enabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all cars by car_model_id
exports.getAllCarsByModelId = async function (req, res) {
  try {
    const cars = await carModel.find(
      { carModelId: req.body.carModelId, isActive: true },
      { carModelName: 1 }
    );

    res.status(200).json({ message: "Success", cars });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update car as popular car
exports.carAsPopular = async function (req, res) {
  try {
    const changetoPopular = await carModel.updateOne(
      { _id: req.params.id },
      { $set: { isPopular: req.body.isPopular } },
      { new: true }
    );

    if (changetoPopular) {
      res.status(200).json({ message: "Car updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// update car as Featured car
exports.carAsFeatured = async function (req, res) {
  try {
    const changetoFeatured = await carModel.updateOne(
      { _id: req.params.id },
      { $set: { isFeatured: req.body.isFeatured } },
      { new: true }
    );

    if (changetoFeatured) {
      res.status(200).json({ message: "Car updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
