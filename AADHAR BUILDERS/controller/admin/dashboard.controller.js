const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const operationModel = require("../../model/operation");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");
const projectNameModel = require("../../model/projectName");

// get all dashboard items
exports.getDashboardItems = async function (req, res) {
  //   try {

  /************* Project Name  **************/
  const projectNamedata = await projectNameModel
    .findOne({}, { title: 1 })
    .sort({ logDateCreated: -1 });

  projectName = projectNamedata.title;

  // total number of plots count *************************
  const totalPlots = await plotModel.find().countDocuments();
  console.log(totalPlots);
  console.log("totalPlots");

  // total number of vaccant plots
  const totaVacantPlots = await plotModel
    .find({ status: false, stage: 0 })
    .countDocuments();
  console.log(totaVacantPlots);
  console.log("totaVacantPlots");
  // total number of plots with just advance amount paid ******************
  const totaPlotAdvance = await plotModel
    .find({
      $and: [{ stage: { $gte: 1 } }, { stage: { $lte: 5 } }],
      status: true
    })
    .countDocuments();
  console.log(totaPlotAdvance);
  console.log("totaPlotAdvance");
  // total number of sold out plots *****************************
  const totalSoldPlots = await plotModel
    .find({ stage: { $gte: 5 }, status: true })
    .countDocuments();

  // total capital recieved as advance amount ************************
  const totaPlotAdvancePaid = await plotModel.find(
    {
      $and: [{ stage: { $gt: 0 } }, { stage: { $lt: 5 } }],
      status: true
    },
    { _id: 0, totalPaidAmount: 1 }
  );

  let PlotAdvancePaid = totaPlotAdvancePaid.map((item) => {
    return item.totalPaidAmount;
  });

  // console.log(PlotAdvancePaid); *************************

  let totalAdvancePaid = 0;
  for (let i = 0; i < PlotAdvancePaid.length; i++) {
    totalAdvancePaid = totalAdvancePaid + PlotAdvancePaid[i];
  }

  // console.log(totalAdvancePaid)

  // total capital recieved for all sold out plots ********************
  const soldPlotAmount = await plotModel.find(
    { stage: { $gt: 4 }, status: true },
    { _id: 0, totalPaidAmount: 1 }
  );

  let soldTotalPlotAmount = soldPlotAmount.map((val) => {
    return val.totalPaidAmount;
  });

  // console.log(soldTotalPlotAmount)

  let totalSoldAmount = 0;
  for (let j = 0; j < soldTotalPlotAmount.length; j++) {
    totalSoldAmount = totalSoldAmount + soldTotalPlotAmount[j];
  }

  let totalAmount = totalAdvancePaid + totalSoldAmount;

  // total capital as balance for all plots ***********************
  const plotBalance = await plotModel.find(
    { status: true },
    { _id: 0, balanceAmount: 1 }
  );

  let plotTotlBalance = plotBalance.map((itm) => {
    return itm.balanceAmount;
  });

  let totalBalanceAmount = 0;
  for (let k = 0; k < plotTotlBalance.length; k++) {
    totalBalanceAmount = totalBalanceAmount + plotTotlBalance[k];
  }

  // total paid amount till date **********************************
  const amountTotalPay = await plotModel.find(
    { status: true },
    { _id: 0, totalPaidAmount: 1 }
  );

  // let amountTotalPaaid = amountTotalPay.map((itam) => {
  //   return itam.totalPaidAmount;
  // });

  // let totalAmountPaid = 0;
  // for (let l = 0; l < amountTotalPaaid.length; l++) {
  //   totalAmountPaid = totalAmountPaid + amountTotalPaaid[l];
  // }

  // plots data for next installment date *******************
  let dateSearch = {};

  if (req.body.nextInstallmentDate && req.body.nextInstallmentDate != "") {
    dateSearch.nextInstallmentDate = req.body.nextInstallmentDate;
  }

  dateSearch.percentTotalPay = { $gt: 1, $lt: 100 };
  dateSearch.isPayinitiated = true;

  console.log(dateSearch);

  const showPlots = await paymentModel
    .find(dateSearch)
    .sort({ createdAt: -1 })
    .limit(5);

  let plotsResult = [];
  let i = 0;

  await Promise.all(
    showPlots.map(async (item) => {
      const plotsdata = await plotModel.findOne(
        { _id: item.plotId, status: true },
        { _id: 1, plotNumber: 1, percentTotalPay: 1 }
      );

      const customerdata = await customerModel.findOne(
        { _id: item.customerId, status: true },
        { _id: 1, firstName: 1, lastName: 1 }
      );

      const paydata = await paymentModel
        .findOne(
          { _id: item._id, isPayinitiated: true },
          { _id: 1, nextInstallmentDate: 1, updatedAt: 1 }
        )
        .sort({ createdAt: -1 });

      if (plotsdata && plotsdata.percentTotalPay < 100) {
        plotsResult[i] = {};
        plotsResult[i].plotId = plotsdata._id;
        plotsResult[i].plotNumber = plotsdata.plotNumber;
        plotsResult[i].customerName = customerdata
          ? `${customerdata.firstName} ${customerdata.lastName}`
          : "";
        plotsResult[i].nextInstmtDate = paydata
          ? paydata.nextInstallmentDate
          : "";
        plotsResult[i].percent = item.percentTotalPay;
        plotsResult[i].updatedAt = paydata.updatedAt;
        plotsResult[i].stage = item.stage;

        i++;
      } else {
        // plotsResult[i] = {};
        console.log("Percent value is 100 or more");
      }
    })
  );

  // list of latest 10 plots which has stage more than 0 *****************
  const activePlots = await plotModel
    .find({
      stage: { $gt: 0, $lt: 5 },
      status: true
    })
    .sort({ createdAt: -1 })
    .limit(10);

  // list of latest 10 team members *********************
  const teamMembers = await adminModel
    .find({ isDelete: false })
    .sort({ createdAt: -1 })
    .limit(10);

  // pi chart data ********************************************
  let plotStatusGraph = [
    { labels: "", series: 0, colors: 0 },
    { labels: null, series: null, colors: null },
    { labels: null, series: null, colors: null },
    { labels: null, series: null, colors: null },
    { labels: null, series: null, colors: null },
    { labels: null, series: null, colors: null }
  ];

  let daySpan = req.body.daySpan;

  let plotZero;
  let plotOne;
  let plotTwo;
  let plotThree;
  let plotFour;
  let plotFive;

  let today = Date.now();

  let lastweek = 86400000 * daySpan;

  let backDate = today - lastweek;

  let allDate = 721810901581;

  let c = new Date(backDate).toISOString().slice(0, 10);
  let dc = new Date(allDate).toISOString().slice(0, 10);

  console.log(c);
  console.log(dc);

  if (daySpan == 0) {
    plotZero = await plotModel
      .find({
        status: false,
        stage: 0,
        logDateModifiedMill: { $gte: allDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  } else {
    plotZero = await plotModel
      .find({
        status: false,
        stage: 0,
        logDateModifiedMill: { $gte: backDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  }

  if (daySpan == 0) {
    plotOne = await plotModel
      .find({
        status: true,
        stage: 1,
        logDateModifiedMill: { $gte: allDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  } else {
    plotOne = await plotModel
      .find({
        status: true,
        stage: 1,
        logDateModifiedMill: { $gte: backDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  }

  if (daySpan == 0) {
    plotTwo = await plotModel
      .find({
        status: true,
        stage: 2,
        logDateModifiedMill: { $gte: allDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  } else {
    plotTwo = await plotModel
      .find({
        status: true,
        stage: 2,
        logDateModifiedMill: { $gte: backDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  }

  if (daySpan == 0) {
    plotThree = await plotModel
      .find({
        status: true,
        stage: 3,
        logDateModifiedMill: { $gte: allDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  } else {
    plotThree = await plotModel
      .find({
        status: true,
        stage: 3,
        logDateModifiedMill: { $gte: backDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  }

  if (daySpan == 0) {
    plotFour = await plotModel
      .find({
        status: true,
        stage: 4,
        logDateModifiedMill: { $gte: allDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  } else {
    plotFour = await plotModel
      .find({
        status: true,
        stage: 4,
        logDateModifiedMill: { $gte: backDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  }

  if (daySpan == 0) {
    plotFive = await plotModel
      .find({
        status: true,
        stage: 5,
        logDateModifiedMill: { $gte: allDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  } else {
    plotFive = await plotModel
      .find({
        status: true,
        stage: 5,
        logDateModifiedMill: { $gte: backDate }
      })
      .sort({ createdAt: -1 })
      .countDocuments();
  }

  let j = 0;

  plotStatusGraph[j]["labels"] = "Vaccant Plots";
  plotStatusGraph[j]["series"] = plotZero;
  plotStatusGraph[j]["colors"] = "#FFFF00"; // Yellow
  j++;

  plotStatusGraph[j]["labels"] = "Stage 1 Plots";
  plotStatusGraph[j]["series"] = plotOne;
  plotStatusGraph[j]["colors"] = "#00FF00"; // Green
  j++;

  plotStatusGraph[j]["labels"] = "Stage 2 Plots";
  plotStatusGraph[j]["series"] = plotTwo;
  plotStatusGraph[j]["colors"] = "#FFA500"; // Orange
  j++;

  plotStatusGraph[j]["labels"] = "Stage 3 Plots";
  plotStatusGraph[j]["series"] = plotThree;
  plotStatusGraph[j]["colors"] = "#ADD8E6"; // Blue
  j++;

  plotStatusGraph[j]["labels"] = "Stage 4 Plots";
  plotStatusGraph[j]["series"] = plotFour;
  plotStatusGraph[j]["colors"] = "#C8C8C8"; // Light Gray
  j++;

  plotStatusGraph[j]["labels"] = "Stage 5 Plots";
  plotStatusGraph[j]["series"] = plotFive;
  plotStatusGraph[j]["colors"] = "#FF6666"; // Red
  j++;

  // console.log(plotStatusGraph);

  res.status(200).json({
    message: "Success",
    projectName,
    totalPlots,
    totaVacantPlots,
    totaPlotAdvance,
    totalSoldPlots,
    totalAdvancePaid,
    totalSoldAmount,
    totalBalanceAmount,
    totalAmountPaid: totalAmount,
    teamMembers,
    activePlots,
    plotsResult,
    plotStatusGraph
  });
  //   } catch (err) {
  //     res.status(400).json({ message: "Bad request" });
  //   }
};
