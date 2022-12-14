const adminAuthModel = require("../../model/adminAuth");
const countryModel = require("../../model/country");

// add country
exports.addCountry = function (req, res) {
  try {
    countryModel
      .findOne({
        $or: [
          { countryName: req.body.countryName },
          { countryCode: req.body.countryCode }
        ]
      })
      .exec(function (er, cntry) {
        if (cntry) {
          return res.status(400).json({ message: "Country already exist!" });
        } else {
          let logDate = new Date().toISOString();

          const countryObj = new countryModel({
            countryName: req.body.countryName,
            countryCode: req.body.countryCode,
            countryFlag: req.file.path,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          countryObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "Country could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "Country added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get country
exports.getCountry = async function (req, res) {
  try {
    const countResult = await countryModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", countResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all countries
exports.getAllCountries = async function (req, res) {
  try {
    const countriesResult = await countryModel.find().sort({ countryName: 1 });

    res.status(200).json({ message: "Success", countriesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
