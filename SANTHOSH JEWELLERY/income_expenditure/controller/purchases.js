const computerPurchase = require("../model/purchases");
const infra = require("../model/infra")
//adding data
exports.addComputerPurchase = async function (req, res) {
  try {
    const infraData = await infra.findById(
      { _id: req.body.infra_id, },
      { infra_type: 1 }
    );
    const addcpdata = new computerPurchase({
      infra_id:req.body.infra_id,
      infra_name: infraData.infra_type,
      amount: req.body.amount,
      remarks: req.body.remarks,
      date: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(400).json({ success: false, message: err });
      } else {
        res
          .status(200)
          .json({ success: true, message: "successfully inserted data" });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//getting computer purchase
exports.getPurchases = async function (req, res) {
  try {
    const purchaseData = await computerPurchase.find({});
    if (purchaseData) {
      res.status(400).json({
        success: true,
        message: "success",
        purchaseData,
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
