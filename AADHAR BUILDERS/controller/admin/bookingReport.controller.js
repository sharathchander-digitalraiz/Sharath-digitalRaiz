const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");

// Booking report
exports.plotBookingsReport = async function (req, res) {
  //   try {
  let condition = {};

  condition.status = true;

  if (req.body.stage && req.body.stage != "All" && req.body.stage > 0) {
    condition.stage = req.body.stage;
    
  }

  var dates= req.body.logDateModified;

  if (dates.length>1) {
    condition.logDateModified={
      $gte: req.body.logDateModified[0],
      $lte: req.body.logDateModified[1]
    }
  //  condition.logDateModified = req.body.logDateModified;
  }
  else  if (dates.length==1)
  {
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
          _id: 0,
          plotNumber: 1,
          plotFace: 1,
          plotSize: 1,
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

      const customerdata = await customerModel.findOne(
        { plotId: val._id, status: true },
        { firstName: 1, lastName: 1, contactNumber: 1 }
      );

      Mresult[i] = {};
      Mresult[i].plotId = plotsdata._id;
      Mresult[i].logDateModified = plotsdata.logDateModified;
      Mresult[i].plotNumber = plotsdata.plotNumber;
      Mresult[i].plotFace = plotsdata.plotFace;
      Mresult[i].plotSize = plotsdata.plotSize;
      Mresult[i].stage = plotsdata.stage;
      Mresult[i].dealAmount = paydata ? paydata.dealAmount : 0;
      Mresult[i].totalPaidAmount = paydata ? paydata.totalPaidAmount : 0;
      Mresult[i].balanceAmount = paydata ? paydata.balanceAmount : 0;
      Mresult[i].percentTotalPay = paydata ? paydata.percentTotalPay : 0;
      Mresult[i].customerName = customerdata
        ? `${customerdata.firstName} ${customerdata.lastName}`
        : "";
      Mresult[i].customerPhone = customerdata ? customerdata.contactNumber : "";

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
