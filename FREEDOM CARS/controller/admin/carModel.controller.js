const carMable = require("../../model/car");
const carBrandModel = require("../../model/carBrand");
const carModel = require("../../model/carModel");

// add carmodel
exports.addCarmodel = async function (req, res) {
  try {
    const brandd = await carBrandModel.findOne(
      { _id: req.body.brandId },
      { title: 1 }
    );

    let imagesArray = [];
    const uploadFiles = req.files;
    uploadFiles.map((item) => {
      imagesArray.push(item.path);
    });

    let logDate = new Date().toISOString();

    const carmodel = new carModel({
      carType: req.body.carType,
      brandId: req.body.brandId,
      brandName: brandd.title,
      model_name: req.body.model_name,
      noOfSeats: req.body.noOfSeats,
      logDateCreated: logDate,
      logDateModified: logDate,
      carImage: req.files ? imagesArray : console.log("No Img")
    });

    carmodel.save(function (err, data) {
      if (data) {
        res
          .status(201)
          .send({ success: true, message: "Car model added successfully" });
      } else {
        res.status(400).send({ success: false, message: err });
      }
    });
  } catch (err) {
    res.status(400).send({ success: false, message: err });
  }
};

// get all car models
exports.getAllCarModels = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const modelResult = await carModel
      .find({
        $or: [
          { brandName: searchCodtion },
          { model_name: searchCodtion },
          { carType: searchCodtion }
        ]
      })
      .sort({ model_name: 1 });

    res.status(200).json({ message: "Success", modelResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active car models
exports.getAllActiveCarModels = async function (req, res) {
  try {
    const modelResult = await carModel
      .find({ status: true })
      .sort({ model_name: 1 });

    res.status(200).json({ message: "Success", modelResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit model
exports.editCarModel = async function (req, res) {
  try {
    const brandd = await carBrandModel.findOne(
      { _id: req.body.brandId },
      { title: 1 }
    );

    let logDate = new Date().toISOString();

    const updateResult = await carModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          carType: req.body.carType,
          brandId: req.body.brandId,
          brandName: brandd.title,
          model_name: req.body.model_name,
          noOfSeats: req.body.noOfSeats,
          logDateModified: logDate,
          carImage: req.files ? req.files.path : console.log("No Img"),
          status: req.body.status
        }
      },
      { new: true }
    );

    if (updateResult) {
      res.status(200).json({ message: "Car model updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable model
exports.disableCarModel = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const updateResult = await carModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (updateResult) {
      res.status(200).json({ message: "Car model disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get car models based on Car brand Id
exports.getCarModelByBrand = async function (req, res) {
  try {
    const modelsResult = await carModel.find({
      brandId: req.body.brandId
    });

    res.status(200).json({ message: "Success", modelsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get car models based on carType and Car brand Id
exports.getCarModelByTypeAndBrand = async function (req, res) {
  try {
    const modelsResult = await carModel.find({
      carType: req.body.carType,
      brandId: req.body.brandId
    });

    res.status(200).json({ message: "Success", modelsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
