const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");

// Booking report
exports.plotSoldoutReport = async function (req, res) {
  //   try {
  let condition = {};

  condition.status = true;

  condition.stage = 5;

  var dates = req.body.logDateModified;

  if (dates.length > 1) {
    condition.logDateModified = {
      $gte: req.body.logDateModified[0],
      $lte: req.body.logDateModified[1]
    };
    //  condition.logDateModified = req.body.logDateModified;
  } else if (dates.length == 1) {
    condition.logDateModified = req.body.logDateModified[0];
  }

  console.log(condition);

  const showPlots = await plotModel.find(condition).sort({ createdAt: -1 });

  let Mresult = [];

  i = 0;

  await Promise.all(
    showPlots.map(async (val) => {
      const plotsdata = await plotModel.findOne(
        { _id: val._id },
        {
          _id: 1,
          phase: 1,
          plotNumber: 1,
          plotFace: 1,
          plotSize: 1,
          area: 1,
          amountPerSqYard: 1,
          totalAmount: 1,
          stage: 1,
          logDateModified: 1
        }
      );

      const paydata = await paymentModel
        .findOne(
          { plotId: val._id, isPayinitiated: true },
          {
            _id: 1,
            dealAmount: 1,
            totalPaidAmount: 1,
            balanceAmount: 1,
            percentTotalPay: 1
          }
        )
        .sort({ createdAt: -1 });

      const payStagedata = await paymentModel.find(
        { plotId: val._id, isPayinitiated: true },
        {
          _id: 0,
          stage: 1,
          paidAmount: 1
        }
      );

      console.log(payStagedata);

      const customerdata = await customerModel.findOne(
        { plotId: val._id, status: true },
        { firstName: 1, lastName: 1, contactNumber: 1 }
      );

      Mresult[i] = {};
      Mresult[i].plotId = plotsdata._id;
      Mresult[i].phase = plotsdata.phase;
      Mresult[i].logDateModified = plotsdata.logDateModified;
      Mresult[i].plotNumber = plotsdata.plotNumber;
      Mresult[i].plotFace = plotsdata.plotFace;
      Mresult[i].plotSize = plotsdata.plotSize;
      Mresult[i].plotArea = plotsdata.area;
      Mresult[i].amountPerSqYard = plotsdata.amountPerSqYard;
      Mresult[i].totalAmount = plotsdata.totalAmount;
      Mresult[i].dealAmount = paydata ? paydata.dealAmount : "";
      Mresult[i].paidAmount = paydata ? paydata.paidAmount : "";
      Mresult[i].totalPaidAmount = paydata ? paydata.totalPaidAmount : "";
      Mresult[i].balanceAmount = paydata ? paydata.balanceAmount : "";
      Mresult[i].percentTotalPay = paydata ? paydata.percentTotalPay : "";
      Mresult[i].customerName = customerdata
        ? `${customerdata.firstName} ${customerdata.lastName}`
        : "";
      Mresult[i].customerPhone = customerdata ? customerdata.contactNumber : "";
      Mresult[i].payStagedata = payStagedata;

      i++;
    })
  );
  res.status(200).json({
    message: "Success",
    data: Mresult
  });
  //   } catch (err) {
  //     res.status(400).json({ message: "Bad request" });
  //   }
};
