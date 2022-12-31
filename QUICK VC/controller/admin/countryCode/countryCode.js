const countryCodeModel = require("../../../model/countryCode");

// add country code
exports.addCountryCode = function (req, res) {
  try {
    countryCodeModel
      .findOne({ countryName: req.body.countryName })
      .exec(function (eror, code) {
        if (code) {
          res.status(400).json({ message: "Country already exist" });
        } else {
          const codeObj = new countryCodeModel({
            countryName: req.body.countryName,
            cellCode: req.body.cellCode,
            status: req.body.status
          });

          codeObj.save(function (er, data) {
            if (er) {
              res
                .status(400)
                .json({ message: "Country code could not be added" });
            }
            if (data) {
              res
                .status(200)
                .json({ message: "Country code added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all country codes
exports.getAllCountryCodes = async function (req, res) {
  try {
    const codesResult = await countryCodeModel.find().sort({ countryName: 1 });

    res.status(200).json({ message: "Success", codesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active country codes
exports.getAllCountryCodesStatus = async function (req, res) {
  try {
    const codesResult = await countryCodeModel
      .find({ status: true })
      .sort({ countryName: 1 });

    res.status(200).json({ message: "Success", codesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update country code
exports.editCountryCode = async function (req, res) {
  try {
    const changeResult = await countryCodeModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        countryName: req.body.countryName,
        cellCode: req.body.cellCode,
        status: req.body.status
      }
    );

    if (changeResult) {
      res.status(200).json({ message: "Country code updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove country code
exports.removeCountryCode = async function (req, res) {
  try {
    const removeResult = await countryCodeModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removeResult) {
      res.status(200).json({ message: "Country code removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
