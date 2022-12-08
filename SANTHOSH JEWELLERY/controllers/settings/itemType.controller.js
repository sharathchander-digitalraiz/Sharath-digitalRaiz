const ItemType = require("../../models/settings/itemType");

//add items
exports.addItem = async (req, res) => {
  try {
    const item = new ItemType({
      item_name: req.body.item_name,
      status: req.body.status,
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

//get one items
exports.getOneItem = async (req, res) => {
  try {
    const itemsData = await ItemType.findById({ _id: req.params.id });
    if (itemsData) {
      res
        .status(200)
        .json({ success: true, message: "successfull", itemsData });
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

//get all items
exports.getAllItems = async (req, res) => {
    try {
      const itemsData = await ItemType.find({});
      if (itemsData) {
        res
          .status(200)
          .json({ success: true, message: "successfull", itemsData });
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

//edit items
exports.editItem = async (req, res) => {
  try {
    const itemsUpdate = await ItemType.findByIdAndUpdate(
      { _id: req.params.id },
      {
        item_name: req.body.item_name,
        status: req.body.status,
      }
    );
    if (itemsUpdate) {
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

//delete items
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await ItemType.findByIdAndDelete({
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
