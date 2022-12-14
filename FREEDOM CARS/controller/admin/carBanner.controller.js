const carBannerModel = require("../../model/carBanner");

// add car banners
exports.addCarBanner = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const bannerObj = new carBannerModel({
      title: req.body.title,
      bannerImage: req.file.path,
      createdBy: req.userId,
      logDateCreated: logDate,
      logDateModified: logDate
    });

    bannerObj.save(function (er, data) {
      if (er) {
        return res
          .status(400)
          .json({ message: "Car banner could not be added" });
      }
      if (data) {
        res.status(200).json({ message: "Car banner added successfully" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all banners
exports.getAllBanners = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const bannerresult = await carBannerModel
      .find({ title: searchCodtion })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", bannerresult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all active banners
exports.getAllActiveBanners = async function (req, res) {
  try {
    const actBannerResult = await carBannerModel
      .find({ isActive: true })
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", actBannerResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update banner
exports.editBnner = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const changeBanner = await carBannerModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          bannerImage: req.file ? req.file.path : console.log("No Image"),
          logDateModified: logDate,
          isActive: req.body.status
        }
      },
      { new: true }
    );

    if (changeBanner) {
      res.status(200).json({ message: "Banner updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// delete banner
exports.removeBanner = async function (req, res) {
  try {
    const removeResult = await carBannerModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removeResult) {
      res.status(200).json({ message: "Banner removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
