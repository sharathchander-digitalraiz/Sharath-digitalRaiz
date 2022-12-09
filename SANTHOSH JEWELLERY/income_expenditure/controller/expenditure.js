const Expenditure = require("../model/expenditure");

//adding data
exports.addExp = async function (req, res) {
  try {
    const addExp = new Expenditure({
      expenditure_type: req.body.expenditure_type,
      date: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({ success: false, message: err });
      } else {
        res
          .status(400)
          .json({ success: true, message: "successfully inserted data" });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//getting computer purchase
exports.getExp = async function (req, res) {
  try {
    const expData = await Expenditure.find({});
    if (expData) {
      res.status(400).json({
        success: true,
        message: "success",
        expData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Computer Purchase data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};


