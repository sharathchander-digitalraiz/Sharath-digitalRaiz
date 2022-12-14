const carModel = require("../../model/carModel");
const carBrandModel = require("../../model/carBrand");
const carVersionModel = require("../../model/carVersion");

// add car version
exports.addCarVersion = async function (req, res) {
  try {
    const showCarBrand = await carBrandModel.findOne(
      { _id: req.body.brandId },
      { title: 1 }
    );

    const showModel = await carModel.findOne(
      { _id: req.body.modelId },
      { model_name: 1 }
    );

    let logDate = new Date().toISOString();

    const versionObj = new carVersionModel({
      brandId: req.body.brandId,
      brand_name: showCarBrand.title,
      modelId: req.body.modelId,
      model_name: showModel.model_name,
      carVersion: req.body.carVersion,
      logDateCreated: logDate,
      logDateModified: logDate
    });

    versionObj.save(function (er, data) {
      if (er) {
        return res.status(400).json({ message: "version could not be added" });
      }
      if (data) {
        res.status(200).json({ message: "Version added successfully" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all versions
exports.getAllVersions = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const versionsResult = await carVersionModel
      .find({
        $or: [
          { brand_name: searchCodtion },
          { model_name: searchCodtion },
          { carVersion: searchCodtion }
        ]
      })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", versionsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active versions
exports.getAllActiveVersions = async function (req, res) {
  try {
    const versioNResult = await carVersionModel
      .find({ status: "active" })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", versioNResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit varsion
exports.editCarVarsion = async function (req, res) {
  try {
    const showCarBrand = await carBrandModel.findOne(
      { _id: req.body.brandId },
      { title: 1 }
    );

    const showModel = await carModel.findOne(
      { _id: req.body.modelId },
      { model_name: 1 }
    );

    let logDate = new Date().toISOString();

    const changeResult = await carVersionModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          brandId: req.body.brandId,
          brand_name: showCarBrand.title,
          modelId: req.body.modelId,
          model_name: showModel.model_name,
          carVersion: req.body.carVersion,
          logDateModified: logDate,
          status: req.body.status
        }
      },
      { new: true }
    );

    if (changeResult) {
      res.status(200).json({ message: "Version updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable car version
exports.disableCarVarsion = async function (req, res) {
  try {
    const disableResult = await carVersionModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "inactive"
        }
      },
      { new: true }
    );

    if (disableResult) {
      res.status(200).json({ message: "Version disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// enable car version
exports.enableCarVarsion = async function (req, res) {
  try {
    const enableResult = await carVersionModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "active"
        }
      },
      { new: true }
    );

    if (enableResult) {
      res.status(200).json({ message: "Version enabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get car version by car model
exports.getCarVersionByModel = async function (req, res) {
  try {
    const carversions = await carVersionModel.find({
      modelId: req.body.modelId,
      status: "active"
    });

    res.status(200).json({ message: "Success", carversions });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
