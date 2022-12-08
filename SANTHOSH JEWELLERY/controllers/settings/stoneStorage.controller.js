const StoneStorage = require("../../models/settings/stoneStorage");

//add stone storage
exports.addStoneStorage = async (req, res) => {
  try {
    const addStone = new StoneStorage({
      pk_no: req.body.pk_no,
      item_type: req.body.item_type,
      piece: req.body.piece,
      qty_gr: req.body.qty_gr,
      qty_ct: req.body.qty_ct,
    }).save((err, data) => {
      if (err) {
        res.status(400).json({ success: false, message: err });
      } else {
        res.status(200).json({
          success: true,
          message: "inserted successfully",
        });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//edit stone storge
exports.editStoneStorge = async (req, res) => {
  try {
    const updateStone = await StoneStorage.findByIdAndUpdate(
      { _id: req.params.id },
      {
        pk_no: req.body.pk_no,
        item_type: req.body.item_type,
        piece: req.body.piece,
        qty_gr: req.body.qty_gr,
        qty_ct: req.body.qty_ct,
      }
    );
    if (updateStone) {
      res.status(200).json({ success: true, message: "updated successfully" });
    } else {
      res.status(400).json({ success: false, message: "unable to update" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get one stone
exports.getOneStone = async (req, res) => {
  try {
    const stoneData = await StoneStorage.findById({ _id: req.params.id });
    if (stoneData) {
      res
        .status(200)
        .json({ success: true, message: "successfull", stoneData });
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

//get all stone
exports.getAllstones = async (req, res) => {
  try {
    const stoneData = await StoneStorage.find();
    if (stoneData) {
      res
        .status(200)
        .json({ success: true, message: "successfull", stoneData });
     }
    // else {
    //   res.status(400).json({
    //     success: false,
    //     message: "something went wrong unable to find",
    //   });
    //}
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete stone
exports.deleteStone = async (req, res) => {
  try {
    const deletedItem = await StoneStorage.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deletedItem) {
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
