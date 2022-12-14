const countryModel = require("../../model/country");
const stateModel = require("../../model/state");

// add state
exports.addState = function (req, res) {
  try {
    stateModel
      .findOne({ stateName: req.body.stateName })
      .exec(async function (er, stat) {
        if (stat) {
          return res.status(200).json({ message: "State already exist!" });
        } else {
          const countri = await countryModel.findOne(
            { _id: req.body.countryId },
            { countryName: 1 }
          );

          let logDate = new Date().toISOString();

          const stateObj = new stateModel({
            stateName: req.body.stateName,
            countryId: req.body.countryId,
            countryName: countri.countryName,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          stateObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "State could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "State added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get state
exports.getState = async function (req, res) {
  try {
    const stateResult = await stateModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", stateResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all states
exports.getAllStates = async function (req, res) {
  try {
    const statesResult = await stateModel.find().sort({ stateName: 1 });

    res.status(200).json({ message: "Success", statesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active states
exports.getAllActiveState = async function (req, res) {
  try {
    const activeStateResult = await stateModel
      .find({ isActive: true })
      .sort({ stateName: 1 });

    res.status(200).json({ message: "Success", activeStateResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit state
exports.editState = async function (req, res) {
  try {
    const countri = await countryModel.findOne(
      { _id: req.body.countryId },
      { countryName: 1 }
    );

    let logDate = new Date().toISOString();

    const changeState = await stateModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          stateName: req.body.stateName,
          countryId: req.body.countryId,
          countryName: countri.countryName,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeState) {
      res.status(200).json({ message: "State details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// delete state
exports.removeState = async function (req, res) {
  try {
    const removeResult = await stateModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removeResult) {
      res.status(200).json({ message: "State removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
