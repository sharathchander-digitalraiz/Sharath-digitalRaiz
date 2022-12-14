const Feature = require("../../model/feature");

exports.new_feature = async function (req, res) {
  try {
    let logdate = new Date().toISOString();
    const featuresObj = new Feature({
      featureName: req.body.featureName,
      logDateCreated: logdate,
      logDateModified: logdate
    });

    featuresObj.save((err, data) => {
      if (err) {
        res
          .status(400)
          .json({
            success: false,
            message: "data could not be added",
            Error: err
          });
      }
      if (data) {
        res
          .status(200)
          .json({ success: true, message: "data inserted successfully" });
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!", Error: err });
  }
};

exports.edit_feature = async function (req, res) {
  try {
    let logdate = new Date().toISOString();
    const data = await Feature.findOneAndUpdate(
      { _id: req.params.id },
      {
        featureName: req.body.featureName,
        logDateModified: logdate,
        status: req.body.status
      }
    );
    if (data) {
      res
        .status(200)
        .send({
          success: true,
          message: "Feature updated successfully",
          updated: data
        });
    } else {
      res.status(400).send({ success: true, message: "Invalid feature" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error });
  }
};

exports.delete_feature = async function (req, res) {
  try {
    const data = await Feature.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false
        }
      },
      { new: true }
    );
    if (data) {
      res.status(200).send({ success: true, message: "Disabled successfully" });
    } else {
      res.status(400).send({ success: false, message: "Invalid feature" });
    }
  } catch (err) {
    res.status(400).send({ success: false, message: err });
  }
};

exports.getallCarfeatures = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const featureFound = await Feature.find({
      featureName: searchCodtion
    }).sort({ featureName: 1 });

    res.status(200).send({
      success: true,
      message: "successfull",
      featureFound
    });
  } catch (err) {
    res.status(400).send({ success: false, message: "Bad request" });
  }
};

// get all active features
exports.getAllActiveFeatures = async function (req, res) {
  try {
    const featuresResult = await Feature.find({ status: true }).sort({
      featureName: 1
    });

    res.status(200).json({ message: "Success", featuresResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
