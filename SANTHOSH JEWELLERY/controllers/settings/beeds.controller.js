const Beeds = require("../../models/settings/beeds");

//add beed
exports.addBeeds = async (req, res) => {
  try {
    const beeds = new Beeds({
        pocket_no:req.body.pocket_no,
        item: req.body.item,
        qty_ct: req.body.qty_ct,
        rate_ct: req.body.rate_ct,
        Amount: req.body.Amount,
    }).save((err, data) => {
      if (err) {
        res.status(400).json({ success: false, message: err });
      } else {
        res.status(200).json({
          success: true,
          message: "items inserted successfully",
        });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get one beed
exports.getOneBeed= async (req, res) => {
  try {
    const beedsData = await Beeds.findById({ _id: req.params.id });
    if (beedsData) {
      res
        .status(200)
        .json({ success: true, message: "successfull", beedsData });
    } else {
      res.status(400).json({
        success: false,
        message: "something went wrong unable to find",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get all beeds
exports.getAllBeeds = async (req, res) => {
    try {
      const beedsData = await Beeds.find({});
      if (beedsData) {
        res
          .status(200)
          .json({ success: true, message: "successfull", beedsData });
      } else {
        res.status(400).json({
          success: false,
          message: "something went wrong unable to find",
        });
      }
    } catch (err) {
      res.status(400).json({ success: false, message: err });
    }
  };

//edit beeds
exports.editBeeds = async (req, res) => {
  try {
    const beedsUpdate = await Beeds.findByIdAndUpdate(
      { _id: req.params.id },
      {
        pocket_no:req.body.pocket_no,
        item: req.body.item,
        qty_ct: req.body.qty_ct,
        rate_ct: req.body.rate_ct,
        Amount: req.body.Amount,
      }
    );
    if (beedsUpdate) {
      res.status(200).json({
        success: true,
        message: "items updated successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "unable to update the items" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete beeds
exports.deleteBeeds = async (req, res) => {
  try {
    const deleteBeeds = await Beeds.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteBeeds) {
      res.status(200).json({ success: true, message: "successfully deleted" });
    } else {
      res.status(400).json({
        success: false,
        message: "something went wrong unable to delete",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
