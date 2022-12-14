const carSpecsModel = require("../../model/carSpecs");

// add spec
exports.addCarSpecs = function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const carSpecObj = new carSpecsModel({
      specName: req.body.specName,
      logDateCreated: logDate,
      logDateModified: logDate
    });

    carSpecObj.save(function (er, data) {
      if (er) {
        return res
          .status(400)
          .json({ message: "Car specification could not be added" });
      }
      if (data) {
        res
          .status(200)
          .json({ message: "Car specification added successfully" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all specifications
exports.getAllCarSpecs = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const specsResult = await carSpecsModel
      .find({ specName: searchCodtion })
      .sort({ specName: 1 });

    res.status(200).json({ message: "Success", specsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update car specs
exports.editCarSpecs = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeSpecs = await carSpecsModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          specName: req.body.specName,
          status: req.body.status,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeSpecs) {
      res
        .status(200)
        .json({ message: "Car specification updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable specification
exports.disableCarSpec = async function (req, res) {
  try {
    const disableResult = await carSpecsModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false
        }
      },
      { new: true }
    );

    if (disableResult) {
      res.status(200).json({ message: "Specification disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all active specs
exports.getAllActiveSpecs = async function (req, res) {
  try {
    const activeSpecs = await carSpecsModel
      .find({ status: true })
      .sort({ specName: 1 });

    res.status(200).json({ message: "Success", activeSpecs });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
