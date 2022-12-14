const cityModel = require("../../model/city");
const countryModel = require("../../model/country");
const stateModel = require("../../model/state");

// add city
exports.addCity = function (req, res) {
  try {
    cityModel
      .findOne({ cityName: req.body.cityName })
      .exec(async function (er, city) {
        if (city) {
          return res.status(400).json({ message: "City already exist!" });
        } else {
          const coutri = await countryModel.findOne(
            { _id: req.body.countryId },
            { countryName: 1 }
          );

          const showState = await stateModel.findOne(
            { _id: req.body.stateId },
            { stateName: 1 }
          );

          let logDate = new Date().toISOString();

          const cityObj = new cityModel({
            cityName: req.body.cityName,
            countryId: req.body.countryId,
            countryName: coutri.countryName,
            stateId: req.body.stateId,
            stateName: showState.stateName,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          cityObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "City could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "City added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get city
exports.getCity = async function (req, res) {
  try {
    const cityResult = await cityModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", cityResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all cities
exports.getAllCities = async function (req, res) {
  try {
    const cityResult = await cityModel.find().sort({ cityName: 1 });

    res.status(200).json({ message: "Success", cityResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active cities
exports.getAllActiveCities = async function (req, res) {
  try {
    const cityResult = await cityModel
      .find({ isActive: true })
      .sort({ cityName: 1 });

    res.status(200).json({ message: "Success", cityResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
