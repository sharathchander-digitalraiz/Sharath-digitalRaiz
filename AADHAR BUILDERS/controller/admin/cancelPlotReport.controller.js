const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");

// all plots details report
exports.plotCancelReport = async function (req, res) {
  //   try {
  let condition = {};

  // if (req.body.date) {
  //   condition.date = req.body.date;
  // }

  condition.isPlotCancel = "Yes";

  var dates = req.body.logDateModified;

  if (dates.length > 1) {
    condition.logDateModified = {
      $gte: dates[0],
      $lte: dates[1]
    };
    //  condition.logDateModified = req.body.logDateModified;
  } else if (dates.length == 1) {
    condition.logDateModified = dates[0];
  }

  console.log(condition);

  const showPlot = await plotStageModel
    .find(condition, {
      plotId: 1,
      customerId: 1,
      logDateModified: 1,
      dealAmount: 1,
      settleAmount: 1,
      settlePerson: 1,
      totalPaidAmount: 1,
      percentTotalPay: 1
    })
    .sort({ createdAt: -1 });

  let Mresult = [];

  i = 0;

  await Promise.all(
    showPlot.map(async (val) => {
      const plottdata = await plotModel.findOne(
        { _id: val.plotId },
        {
          _id: 1,
          phase: 1,
          plotNumber: 1,
          plotFace: 1,
          plotSize: 1,
          area: 1,
          amountPerSqYard: 1,
          totalAmount: 1
        }
      );

      const customerdata = await customerModel.findOne(
        { _id: val.customerId, plotId: val.plotId },
        {
          firstName: 1,
          lastName: 1,
          contactNumber: 1,
          email: 1,
          presentAddress: 1,
          permanentAddress: 1,
          employeeId: 1,
          refName: 1,
          refPhone: 1
        }
      );

      const paymentdata = await paymentModel.find(
        { plotId: val.plotId, customerId: val.customerId },
        {
          _id: 1,
          plotId: 1,
          payMode: 1,
          accountName: 1,
          accountNumber: 1,
          checkNumber: 1,
          checkValidDate: 1,
          chequeStatus: 1,
          paidAmount: 1,
          totalPaidAmount: 1,
          date: 1,
          stage: 1,
          balanceAmount: 1,
          customerId: 1,
          isPayinitiated: 1
        }
      );

      Mresult[i] = {};
      Mresult[i].plotId = plottdata._id;
      Mresult[i].phase = plottdata.phase;
      Mresult[i].plotNumber = plottdata.plotNumber;
      Mresult[i].plotFace = plottdata.plotFace;
      Mresult[i].plotSize = plottdata.plotSize;
      Mresult[i].plotArea = plottdata.area;
      Mresult[i].amountPerSqYard = plottdata.amountPerSqYard;
      Mresult[i].saleAmount = plottdata.totalAmount;
      Mresult[i].logDateModified = val.logDateModified;
      Mresult[i].dealAmount = val.dealAmount;
      Mresult[i].totalPaidAmount = val.totalPaidAmount;
      Mresult[i].percentTotalPay = val.percentTotalPay;
      Mresult[i].settleAmount = val.settleAmount;
      Mresult[i].settlePerson = val.settlePerson;

      Mresult[i].customerId = customerdata ? customerdata._id : "";
      Mresult[i].customerName = customerdata
        ? `${customerdata.firstName} ${customerdata.lastName}`
        : "";
      Mresult[i].customerPhone = customerdata ? customerdata.contactNumber : "";
      Mresult[i].email = customerdata ? customerdata.email : "";
      Mresult[i].presentAddress = customerdata
        ? customerdata.presentAddress
        : "";
      Mresult[i].permanentAddress = customerdata
        ? customerdata.permanentAddress
        : "";
      Mresult[i].employeeRefName = customerdata ? customerdata.refName : "";
      Mresult[i].employeeRefPhone = customerdata ? customerdata.refPhone : "";
      Mresult[i].payments = paymentdata;

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
