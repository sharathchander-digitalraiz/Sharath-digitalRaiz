const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");

// Booking report
exports.transactionReport = async function (req, res) {
  //   try {
  let condition = {};

  condition.plotId != "1000000000b0000000000203";
  condition.isPayinitiated == true;

  // if (req.body.date) {
  //   condition.date = req.body.date;
  // }

  var dates = req.body.date;

  if (dates.length > 1) {
    condition.date = {
      $gte: dates[0],
      $lte: dates[1]
    };
    //  condition.logDateModified = req.body.logDateModified;
  } else if (dates.length == 1) {
    condition.date = dates[0];
  }

  const showPaymenet = await paymentModel
    .find(condition, {
      _id: 1,
      paidAmount: 1,
      payMode: 1,
      plotId: 1,
      customerId: 1,
      date: 1,
      isPayinitiated: 1
    })
    .sort({ createdAt: -1 });

  let Mresult = [];

  i = 0;

  await Promise.all(
    showPaymenet.map(async (val) => {
      const plotsdata = await plotModel.findOne(
        { _id: val.plotId, status: true },
        {
          _id: 1,
          plotNumber: 1,
          percentTotalPay: 1,
          plotFace: 1,
          plotSize: 1,
          stage: 1,
          logDateModified: 1
        }
      );

      const customerdata = await customerModel.findOne(
        { plotId: val.plotId, status: true },
        { firstName: 1, lastName: 1, contactNumber: 1 }
      );

      if (plotsdata && plotsdata.percentTotalPay > 0) {
        Mresult[i] = {};
        Mresult[i].plotId = plotsdata ? plotsdata._id : "";
        Mresult[i].plotNumber = plotsdata ? plotsdata.plotNumber : "";
        Mresult[i].date = val.date;
        Mresult[i].dealAmount = val.dealAmount;
        Mresult[i].paidAmount = val.paidAmount;
        Mresult[i].payMode = val.payMode;
        Mresult[i].isPayinitiated = val.isPayinitiated;
        Mresult[i].customerName = customerdata
          ? `${customerdata.firstName} ${customerdata.lastName}`
          : "";
        Mresult[i].customerPhone = customerdata
          ? customerdata.contactNumber
          : "";

        i++;
      } else {
        console.log("Percent value is 0");
      }
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
