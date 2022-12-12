const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");

// Booking report
exports.vacantReport = async function (req, res) {
  try {
     const {face}=req.body;
     var condition={};
     condition.stage=0;
     condition.status=false;
     if(face!='All')
     {
        condition.plotFace=face;
     }
        const showPlots = await plotModel
        .find(condition)
        .sort({ createdAt: -1 });

        res.status(200).json({message: "Success",data: showPlots});
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};