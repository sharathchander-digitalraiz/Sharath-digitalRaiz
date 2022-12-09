const Infra = require("../model/infra");
const expenditure = require("../model/expenditure");

//adding data
exports.addInfra = async function (req, res) {
  try {
    const expData = await expenditure.findById(
        { _id: req.body.expenditure_id, },
        { expenditure_type: 1 }
      );
    const addInfraData = new Infra({
      expenditure_id: req.body.expenditure_id,
      expenditure_name: expData.expenditure_type,
      infra_type: req.body.infra_type,
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
exports.getInfra = async function (req, res) {
  try {
    const infraData = await Infra.find({});
    if (infraData) {
      res.status(400).json({
        success: true,
        message: "success",
        infraData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

