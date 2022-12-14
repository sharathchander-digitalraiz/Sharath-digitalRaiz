const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const projectNameModel = require("../../model/projectName");

// all plots details report
exports.plotDetailsReport = async function (req, res) {
  //   try {

  const projectNamedata = await projectNameModel
    .findOne({}, { title: 1 })
    .sort({ logDateCreated: -1 });

  projectName = projectNamedata.title;

  let condition = {};

  // if (req.body.date) {
  //   condition.date = req.body.date;
  // }

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

  const showPlot = await plotModel
    .find(condition, {
      _id: 1,
      stage: 1,
      phase: 1,
      plotNumber: 1,
      plotFace: 1,
      plotSize: 1,
      area: 1,
      status: 1,
      totalAmount: 1,
      dealAmount: 1,
      amountPerSqYard: 1,
      totalPaidAmount: 1,
      percentTotalPay: 1,
      percentColorPay: 1,
      customerId: 1,
      paymentIds: 1,
      registoryStatus: 1,
      logDateModified: 1
    })
    .sort({ createdAt: -1 });

  let Mresult = [];

  let i = 0;

  await Promise.all(
    showPlot.map(async (val) => {
      let stageZeroAmount = 0;
      let stageOneAmount = 0;
      let stageTwoAmount = 0;
      let stageThreeAmount = 0;
      let stageFourAmount = 0;
      let stageFiveAmount = 0;

      let finalPayArr = [];
      // let stageZeroArr = [];
      // let stageOneArr = [];
      // let stageTwoArr = [];
      // let stageThreeArr = [];
      // let stageFourArr = [];
      // let stageFiveArr = [];
      const paymentdata = await paymentModel.find(
        { plotId: val._id, customerId: val.customerId, isPayinitiated: true },
        {
          _id: 1,
          plotId: 1,
          payMode: 1,
          accountName: 1,
          accountNumber: 1,
          checkNumber: 1,
          checkValidDate: 1,
          chequeStatus: 1,
          dealAmount: 1,
          dealDate: 1,
          stage: 1,
          paidAmount: 1,
          totalPaidAmount: 1,
          balanceAmount: 1,
          customerId: 1,
          isPayinitiated: 1
        }
      );

      // console.log(paymentdata);

      for (let pay of paymentdata) {
        if (pay.stage == 0) {
          stageZeroAmount = stageZeroAmount + pay.paidAmount;
        } else {
          console.log("No payment in stage zero");
        }
        if (pay.stage == 1) {
          stageOneAmount = stageOneAmount + pay.paidAmount;
        } else {
          console.log("No payment for stage one");
        }
        if (pay.stage == 2) {
          stageTwoAmount = stageTwoAmount + pay.paidAmount;
        } else {
          console.log("No payment for stage two");
        }
        if (pay.stage == 3) {
          stageThreeAmount = stageThreeAmount + pay.paidAmount;
        } else {
          console.log("No payment for stage two");
        }
        if (pay.stage == 4) {
          stageFourAmount = stageFourAmount + pay.paidAmount;
        } else {
          console.log("No payment for stage two");
        }
        if (pay.stage == 5) {
          stageFiveAmount = stageFiveAmount + pay.paidAmount;
        } else {
          console.log("No payment for stage two");
        }
      }

      finalPayArr.push(
        stageZeroAmount,
        stageOneAmount,
        stageTwoAmount,
        stageThreeAmount,
        stageFourAmount,
        stageFiveAmount
      );

      console.log(finalPayArr);

      const customerdata = await customerModel.findOne(
        { _id: val.customerId, plotId: val._id },
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

      Mresult[i] = {};
      Mresult[i].plotId = val._id;
      Mresult[i].phase = val.phase;
      Mresult[i].plotNumber = val.plotNumber;
      Mresult[i].plotFace = val.plotFace;
      Mresult[i].plotSize = val.plotSize;
      Mresult[i].plotArea = val.area;
      Mresult[i].logDateModified = val.logDateModified;
      Mresult[i].totalAmount = val.totalAmount;
      Mresult[i].amountPerSqYard = val.amountPerSqYard;
      Mresult[i].dealAmount = val.dealAmount;
      Mresult[i].totalPaidAmount = val.totalPaidAmount;
      Mresult[i].percentTotalPay = val.percentTotalPay;
      Mresult[i].registoryStatus = val.registoryStatus;
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

      // payments
      Mresult[i].payments = paymentdata;
      Mresult[i].payResult = finalPayArr;

      i++;
    })
  );

  res.status(200).json({
    message: "Success",
    projectName: projectName,
    data: Mresult
  });
  //   } catch (err) {
  //     res.status(400).json({ message: "Bad request" });
  //   }
};

/*
Mresult[i].paymentId = paymentdata ? paymentdata._id : "";
      Mresult[i].payMode = paymentdata ? paymentdata.payMode : "";
      Mresult[i].accountName = paymentdata ? paymentdata.accountName : "";
      Mresult[i].accountNumber = paymentdata ? paymentdata.accountNumber : "";
      Mresult[i].checkNumber = paymentdata ? paymentdata.checkNumber : "";
      Mresult[i].checkValidDate = paymentdata ? paymentdata.checkValidDate : "";
      Mresult[i].chequeStatus = paymentdata ? paymentdata.chequeStatus : "";
      Mresult[i].dealDate = paymentdata ? paymentdata.dealDate : "";
      Mresult[i].stage = paymentdata ? paymentdata.stage : "";
      
      Mresult[i].paidAmount = paymentdata ? paymentdata.paidAmount : "";
      Mresult[i].paymentActive = paymentdata
        ? paymentdata.isPayinitiated
        : false;
*/
