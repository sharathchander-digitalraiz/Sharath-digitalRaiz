// import model
const carBrandModel = require("../../model/carBrand");

// add state
exports.addCarBrand = function (req, res) {
  try {
    carBrandModel
      .findOne({ title: req.body.title })
      .exec(async function (er, carr) {
        if (carr) {
          return res.status(200).json({ message: "Car brand already exist!" });
        } else {
          let logDate = new Date().toISOString();

          const carObj = new carBrandModel({
            title: req.body.title,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          carObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "Car brand could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "Car brand added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get state
exports.getCarBrand = async function (req, res) {
  try {
    const carBrandResult = await carBrandModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", carBrandResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all states
exports.getAllCarBrand = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const carBrandResult = await carBrandModel
      .find({
        $or: [{ title: searchCodtion }, { logDateCreated: searchCodtion }]
      })
      .sort({ title: 1 });

    res.status(200).json({ message: "Success", carBrandResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active states
exports.getAllActiveCarBrand = async function (req, res) {
  try {
    const activecarBrandResult = await carBrandModel
      .find({ isActive: true })
      .sort({ title: 1 });

    res.status(200).json({ message: "Success", activecarBrandResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// edit state
exports.editCarBrand = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeCarBrand = await carBrandModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          isActive: req.body.isActive,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeCarBrand) {
      res.status(200).json({ message: "Car brand updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable car brand
exports.disableCarBrand = async function (req, res) {
  try {
    const removeResult = await carBrandModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isActive: false
        }
      },
      { new: true }
    );

    if (removeResult) {
      res.status(200).json({ message: "Car brand removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
// delete state
exports.removeCarBrand = async function (req, res) {
  try {
    const removeResult = await carBrandModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removeResult) {
      res.status(200).json({ message: "Car brand removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
