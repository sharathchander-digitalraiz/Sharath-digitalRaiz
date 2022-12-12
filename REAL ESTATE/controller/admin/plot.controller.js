const multer = require("multer");
const excelToJson = require("convert-excel-to-json");
//const readXlsxFile = require("read-excel-file/node");

const plotModel = require("../../model/plot");
const plotStageModel = require("../../model/plotStage");
const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const adminModel = require("../../model/adminAuth");
const projectNameModel = require("../../model/projectName");
const operationModel = require("../../model/operation");
var XLSX = require("xlsx");

// import cut-off analyser data from excel sheet to cutoff analysis collection in mongodb..
// convert excel to JSON..
exports.importPlotDetails = async function (req, res) {
  let today = new Date().toISOString().slice(0, 10);

  const plotcount = await plotModel.find().countDocuments();

  if (plotcount == 0) {
    importExcelData2MongoDB(req.file.path, req.file.fileName);
    const projectObj = new projectNameModel({
      title: req.body.title,
      logDateCreated: today,
      logDateModified: today
    });
    projectObj.save();
    res.status(200).json({
      success: true,
      login: true,
      message: "Successfully completed"
    });
  } else {
    res.status(400).json({
      success: false,
      login: true,
      message: "Plots not added"
    });
  }
};

// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath, fileName) {
  let plotdata = [];
  var workbook = XLSX.readFile(filePath);
  var sheet_name_list = workbook.SheetNames;

  sheet_name_list.forEach(function (y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for (z in worksheet) {
      if (z[0] === "!") continue;
      //parse out the column, row, and value
      var tt = 0;
      for (var i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
          tt = i;
          break;
        }
      }
      var col = z.substring(0, tt);
      var row = parseInt(z.substring(tt));
      var value = worksheet[z].v;

      //store header names
      if (row == 1 && value) {
        headers[col] = value;
        continue;
      }
      if (!data[row]) data[row] = {};
      data[row][headers[col]] = value;
      console.log(data);
      plotdata = data;
    }

    //drop those first two rows which are empty
    data.shift();
    data.shift();
    console.log(data);
  });

  // parseXlsx(filePath, function(err, data) {
  //   if(err) throw err;
  //   console.log(data);
  //     // data is an array of arrays
  // });

  let logDate = new Date().toISOString().slice(0, 10);
  let logDateMilli = Date.now();
  console.log(filePath);
  let excelData = [];
  // -> Read Excel File to Json Data
  /*
  const excelData = excelToJson({
    sourceFile: filePath,
    sheets: [
      {
        // Excel Sheet Name
        name: fileName,
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1
        },
        // Mapping columns to keys
        columnToKey: {
          A: "phase",
          B: "plotNumber",
          C: "plotSize",
          D: "area",
          E: "plotFace",
          F: "amountPerSqYard",
          G: "totalAmount"
        }
      }
    ]
  });


  // -> Log Excel Data to Console
  console.log(excelData);
  */
  const docs = [];
  await Promise.all(
    plotdata.map(async (element, dind) => {
      console.log(element);

      docs.push({
        phase: element.Phase,
        plotNumber: element.Plotnumber,
        plotSize: element.Plotsize,
        area: element.Area,
        plotFace: element.Plotface,
        amountPerSqYard: element.Amountpersqyard,
        totalAmount: element.Totalamount,
        dealAmount: 0,
        logDateCreated: logDate,
        logDateModified: logDate,
        logDateModifiedMill: logDateMilli
      });
    })
  );

  console.log(docs);
  await Promise.all(
    docs.map(async (val, index) => {
      console.log(val);

      plotModel
        .findOne({ plotNumber: val.plotNumber, phase: val.phase })
        .exec(async function (erer, ploat) {
          if (ploat) {
            await plotModel.updateOne(
              { plotNumber: val.plotNumber, phase: val.phase },
              {
                $set: {
                  phase: val.phase,
                  plotNumber: val.plotNumber,
                  plotSize: val.plotSize,
                  area: val.area,
                  plotFace: val.plotFace,
                  amountPerSqYard: val.amountPerSqYard,
                  totalAmount: val.totalAmount,
                  dealAmount: 0,
                  logDateModified: logDate,
                  logDateModifiedMill: logDateMilli
                }
              },
              { new: true }
            );
          } else {
            const list = new plotModel({
              phase: val.phase,
              plotNumber: val.plotNumber,
              plotSize: val.plotSize,
              area: val.area,
              plotFace: val.plotFace,
              amountPerSqYard: val.amountPerSqYard,
              totalAmount: val.totalAmount,
              dealAmount: 0,
              logDateCreated: logDate,
              logDateModified: logDate,
              logDateModifiedMill: logDateMilli
            });

            await list.save();
          }
        });
    })
  );
}

// add individual plot
exports.addPlot = function (req, res) {
  try {
    let logDateMilli = Date.now();
    plotModel
      .findOne({ plotNumber: req.body.plotNumber, phase: req.body.phase })
      .exec(async function (erer, ploat) {
        if (ploat) {
          return res.status(400).json({ message: "Plot already added" });
        } else {
          let logDate = new Date().toISOString().slice(0, 10);

          const plotObj = new plotModel({
            plotNumber: req.body.plotNumber,
            phase: req.body.phase,
            area: req.body.area,
            plotSize: req.body.plotSize,
            plotFace: req.body.plotFace,
            amountPerSqYard: req.body.amountPerSqYard,
            totalAmount: req.body.totalAmount,
            dealAmount: 0,
            createdBy: req.userId,
            modifiedBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate,
            logDateModifiedMill: logDateMilli,
            remark: req.body.remark
          });

          plotObj.save(function (ererr, data) {
            if (ererr) {
              return res
                .status(400)
                .json({ message: "Plot could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "Plot added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get a plot
exports.getPlot = async function (req, res) {
  try {
    const plotsResult = await plotModel.find({ _id: req.body._id });

    res.status(200).json({ message: "Success", plotsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get customer details and payments list based on plotid
exports.getPlotDetails = async function (req, res) {
  try {
    const plotResult = await plotModel.find(
      { _id: req.body.plotId, status: true },
      {}
    );

    let total_amountPaid = plotResult.totalPaidAmount;

    const customersResult = await customerModel
      .find({
        plotId: req.body.plotId,
        status: true
      })
      .sort({ _id: -1 });

    const paymetsResult = await paymentModel
      .find(
        {
          plotId: req.body.plotId,
          // isPayinitiated: true,
          customerId: customersResult[0]._id
        },
        {
          date: 1,
          payMode: 1,
          paidAmount: 1,
          balanceAmount: 1,
          totalPaidAmount: 1,
          checkNumber: 1,
          checkValidDate: 1,
          accountName: 1,
          accountNumber: 1,
          dealAmount: 1,
          dealDate: 1,
          chequeStatus: 1,
          isPayinitiated: 1
        }
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Success",
      plotResult,
      total_amountPaid,
      customersResult,
      paymetsResult
    });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all plots
exports.getAllPlots = async function (req, res) {
  try {
    const PlotsResult = await plotModel.find().sort({ plotNumber: 1 });

    res.status(200).json({ message: "Success", PlotsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all plots above zero stage
exports.getStagewisePlots = async function (req, res) {
  try {
    const showPlots = await plotModel
      .find({ stage: { $gt: 0 }, status: true })
      .sort({ createdAt: -1 });

    let PlotsResult = [];
    let i = 0;

    await Promise.all(
      showPlots.map(async (val) => {
        const customm = await customerModel.findOne(
          { plotId: val._id, status: true },
          {
            firstName: 1,
            lastName: 1,
            email: 1,
            contactNumber: 1,
            presentAddress: 1,
            permanentAddress: 1
          }
        );

        PlotsResult[i] = {};
        PlotsResult[i]._id = val._id;
        PlotsResult[i].plotNumber = val.plotNumber;
        PlotsResult[i].phase = val.phase;
        PlotsResult[i].area = val.area;
        PlotsResult[i].plotSize = val.plotSize;
        PlotsResult[i].plotFace = val.plotFace;
        PlotsResult[i].amountPerSqYard = val.amountPerSqYard;
        PlotsResult[i].totalAmount = val.totalAmount;
        PlotsResult[i].status = val.status;
        PlotsResult[i].totalPaidAmount = val.totalPaidAmount;
        PlotsResult[i].balanceAmount = val.balanceAmount;
        PlotsResult[i].stage = val.stage;
        PlotsResult[i].percentTotalPay = val.percentTotalPay;
        PlotsResult[i].percentColorPay = val.percentColorPay;
        PlotsResult[i].customerFirstName = customm ? customm.firstName : "";
        PlotsResult[i].customerLastName = customm ? customm.lastName : "";
        PlotsResult[i].customerPhone = customm ? customm.contactNumber : "";
        PlotsResult[i].customerEmail = customm ? customm.email : "";
        PlotsResult[i].customerpresAddress = customm
          ? customm.presentAddress
          : "";
        PlotsResult[i].customerpermAddress = customm
          ? customm.permanentAddress
          : "";
        PlotsResult[i].logDateModified = val.logDateModified;
        i++;
      })
    );

    res.status(200).json({ message: "Success", PlotsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get project name
exports.getProjectName = async function (req, res) {
  try {
    const projectName = await projectNameModel
      .findOne()
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", projectName });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all plots based on phase number
exports.getAllPlotsOnphase = async function (req, res) {
  try {
    const phaseonePlotsResult = await plotModel
      .find({ phase: 1 })
      .sort({ plotNumber: 1 });
    const phasetwoPlotsResult = await plotModel
      .find({ phase: 2 })
      .sort({ plotNumber: 1 });
    res
      .status(200)
      .json({ message: "Success", phaseonePlotsResult, phasetwoPlotsResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update single plot deatails
exports.editPlotDetails = async function (req, res) {
  try {
    let logDateMilli = Date.now();
    const userrr = await adminModel.findOne(
      { _id: req.userId },
      { role: 1, firstName: 1, lastName: 1 }
    );

    const changePlot = await plotModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          plotSize: req.body.plotSize,
          area: req.body.area,
          plotFace: req.body.plotFace,
          amountPerSqYard: req.body.amountPerSqYard,
          totalAmount: req.body.totalAmount,
          dealAmount: req.body.dealAmount,
          employeeId: req.userId,
          employeeName: `${userrr.firstName} ${userrr.lastName}`,
          remark: req.body.remark,
          logDateModified: new Date().toISOString().slice(0, 10),
          logDateModifiedMill: logDateMilli
        }
      },
      { new: true }
    );

    if (changePlot) {
      res.status(200).json({ message: "Plot details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// update plot with stages
exports.editPlot = async function (req, res) {
  try {
    const showPlot = await plotModel.findOne(
      { _id: req.params.id },
      { stage: 1, totalAmount: 1 }
    );

    console.log(showPlot.stage);

    const user_id = req.userId;
    const plot_id = req.params.id;

    switch (showPlot.stage) {
      case 0:
        const stageZero = await plotStageZeroupdate(user_id, plot_id, req);

        console.log(stageZero.currentStage);
        if (
          stageZero.currentStage != null ||
          stageZero.currentStage != undefined
        ) {
          const modifyPayPercent = await paymentModel.updateOne(
            { plotId: plot_id, isPayinitiated: true },
            {
              $set: {
                percentTotalPay: stageZero.percentPay,
                stage: stageZero.currentStage,
                balanceAmount: stageZero.balance
              }
            },
            { new: true }
          );

          console.log(modifyPayPercent);
        }

        res.status(stageZero.code).json({ message: stageZero.message });
        break;
      case 1:
      case 2:
      case 3:
      case 4:
        const stageNext = await plotStageNextupdate(user_id, plot_id, req);
        console.log(stageNext);
        const newPay = await paymentModel
          .findOne({ plotId: plot_id, isPayinitiated: true }, { _id: 1 })
          .sort({ createdAt: -1 });
        const modifyNextPayPercent = await paymentModel.updateOne(
          { _id: newPay._id },
          {
            $set: {
              percentTotalPay: stageNext.percentPay
            }
          },
          { new: true }
        );
        res.status(200).json({ message: "updated successfully" });
        break;
      case 5:
        res
          .status(200)
          .json({ message: "Plot sold out please complete the registry" });
        break;
      default:
        res
          .status(400)
          .json({ message: "Please add customer and payements details" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

async function plotStageZeroupdate(user_id, plot_id, req) {
  const plotdata = await plotModel.findById(
    { _id: plot_id },
    {
      stage: 1,
      status: 1,
      plotSize: 1,
      amountPerSqYard: 1,
      totalAmount: 1,
      dealAmount: 1
    }
  );
  console.log("plotdata.stage");
  console.log(plotdata.stage);
  console.log(plotdata.status);
  if (
    plotdata.status == false &&
    (plotdata.stage == "0" || plotdata.stage == 0)
  ) {
    const employdata = await adminModel.findById(
      { _id: user_id },
      { firstName: 1, lastName: 1 }
    );

    // console.log(plotdata.totalAmount);

    const customerObj = new customerModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      presentAddress: req.body.presentAddress,
      permanentAddress: req.body.permanentAddress,
      plotId: plot_id,
      employeeId: user_id,
      refName: req.body.refName,
      refPhone: req.body.refPhone,
      remark: req.body.remark,
      status: true
    });

    customerObj.save();

    // console.log(customerObj);

    let logDate = new Date().toISOString().slice(0, 10);
    let logDateMilli = Date.now();
    const payObj = new paymentModel({
      plotId: plot_id,
      plotSize: plotdata.plotSize,
      amountPerSqrYrd: plotdata.amountPerSqYard,
      totalAmount: plotdata.totalAmount,
      debitAmount: 0,
      customerId: customerObj._id,
      date: logDate,
      payMode: req.body.payMode,
      checkNumber: req.body.checkNumber,
      checkValidDate: req.body.checkValidDate,
      accountName: req.body.accountName,
      accountNumber: req.body.accountNumber,
      dealAmount: req.body.dealAmount,
      dealDate: req.body.dealDate,
      paidAmount: req.body.paidAmount,
      totalPaidAmount: req.body.paidAmount,
      balanceAmount: req.body.balanceAmount ? req.body.balanceAmount : 0,
      numberOfInstallment: req.body.numberOfInstallment,
      nextInstallmentDate: req.body.nextInstallmentDate,
      chequeStatus: "accepted",
      isPayinitiated: true
    });

    payObj.save();
    // console.log(payObj); // 2430000

    let paymentRemain = req.body.dealAmount - req.body.paidAmount;

    let pay = req.body.paidAmount / req.body.dealAmount;

    let percentPay = Math.floor(pay * 100);

    // console.log(percentPay);

    let percentColor;
    let currentStage;

    if (percentPay >= 1 && percentPay <= 25) {
      percentColor = "#00FF00"; // Green
      currentStage = 1;
    } else if (percentPay > 25 && percentPay <= 50) {
      percentColor = "#FFA500"; // Orange
      currentStage = 2;
    } else if (percentPay > 50 && percentPay <= 75) {
      percentColor = "#ADD8E6"; // Blue
      currentStage = 3;
    } else if (percentPay > 75 && percentPay <= 99) {
      percentColor = "#C8C8C8"; // Light Gray
      currentStage = 4;
    } else if (percentPay >= 100) {
      percentColor = "#880ED49C"; // Violet
      currentStage = 5;
    } else {
      currentStage = 0;
      percentColor = "#FFFF00"; // Yellow
      console.log("No color");
    }

    const plotstageObj = new plotStageModel({
      plotId: plot_id,
      plotSize: plotdata.plotSize,
      amountPerSqrYrd: plotdata.amountPerSqYard,
      dealAmount: req.body.dealAmount,
      customerId: customerObj._id,
      paymentId: payObj._id,
      user_id: user_id,
      stage: currentStage > 0 ? currentStage : 1,
      totalPaidAmount: req.body.paidAmount,
      percentTotalPay: percentPay,
      percentColorPay: percentColor,
      logDateModified: logDate
    });

    plotstageObj.save();

    const changePlot = await plotModel.updateOne(
      { _id: plot_id },
      {
        $set: {
          stage: currentStage > 0 ? currentStage : 1,
          totalPaidAmount: req.body.paidAmount,
          dealAmount: req.body.dealAmount,
          amountPerSqYard: req.body.amountPerSqYard
            ? Math.floor(req.body.amountPerSqYard)
            : console.log("per sqYard older value"),
          balanceAmount: paymentRemain,
          percentTotalPay: percentPay,
          percentColorPay: percentColor,
          customerId: customerObj._id,
          customerName: customerObj.firstName + " " + customerObj.lastName,
          customerPhone: customerObj.contactNumber,
          paymentIds: payObj._id,
          employeeId: user_id,
          employeeName: `${employdata.firstName} ${employdata.lastName}`,
          logDateModified: logDate,
          logDateModifiedMill: logDateMilli,
          remark: "",
          status: true
        }
      },
      { new: true }
    );

    let stageZero = {
      code: 200,
      message: "Successfully updated",
      percentPay: percentPay,
      currentStage: currentStage,
      balance: paymentRemain
    };

    return stageZero;
  } else {
    stageZero = {
      code: 400,
      message: "Plot already booked"
    };
    return stageZero;
  }
}

async function plotStageNextupdate(user_id, plot_id, req) {
  const showplot = await plotModel.findOne(
    { _id: plot_id },
    {
      stage: 1,
      status: 1,
      plotSize: 1,
      amountPerSqYard: 1,
      totalAmount: 1,
      dealAmount: 1
    }
  );

  const showCustomer = await customerModel
    .findOne({ plotId: plot_id, status: true }, { _id: 1 })
    .sort({ createdAt: -1 });

  const showlastPay = await paymentModel
    .findOne(
      { plotId: plot_id, isPayinitiated: true, customerId: showCustomer._id },
      { totalPaidAmount: 1, dealAmount: 1, dealDate: 1 }
    )
    .sort({ createdAt: -1 });

  let total_paidAmount = showlastPay.totalPaidAmount + req.body.paidAmount;

  console.log(total_paidAmount);

  let paymentRemain = req.body.dealAmount - total_paidAmount;

  let pay = total_paidAmount / req.body.dealAmount;

  let percentPay = Math.floor(pay * 100);

  let percentColor;
  let currentStage;

  if (percentPay > 1 && percentPay <= 25) {
    percentColor = "#00FF00"; // Green
    currentStage = 1;
  } else if (percentPay > 25 && percentPay <= 50) {
    percentColor = "#FFA500"; // Orange
    currentStage = 2;
  } else if (percentPay > 50 && percentPay <= 75) {
    percentColor = "#ADD8E6"; // Blue
    currentStage = 3;
  } else if (percentPay > 75 && percentPay <= 99) {
    percentColor = "#C8C8C8"; // Light Gray
    currentStage = 4;
  } else if (percentPay >= 100) {
    percentColor = "#880ED49C"; // Violet
    currentStage = 5;
  } else {
    currentStage = 0;
    percentColor = "#FFFF00"; // Yellow
    console.log("No color");
  }

  console.log(total_paidAmount);

  let logDate = new Date().toISOString().slice(0, 10);
  let logDateMilli = Date.now();
  const nextPayObj = new paymentModel({
    plotId: plot_id,
    plotSize: showplot.plotSize,
    amountPerSqrYrd: showplot.amountPerSqYard,
    totalAmount: showplot.totalAmount,
    customerId: showCustomer._id,
    date: logDate,
    payMode: req.body.payMode,
    checkNumber: req.body.checkNumber,
    checkValidDate: req.body.checkValidDate,
    accountName: req.body.accountName,
    accountNumber: req.body.accountNumber,
    stage: currentStage,
    dealAmount: req.body.dealAmount,
    dealDate: req.body.dealDate,
    paidAmount: req.body.paidAmount,
    debitAmount: 0,
    totalPaidAmount: total_paidAmount,
    balanceAmount: paymentRemain,
    numberOfInstallment: req.body.numberOfInstallment,
    nextInstallmentDate: req.body.nextInstallmentDate,
    chequeStatus: "accepted",
    isPayinitiated: true
  });

  nextPayObj.save();

  const changePlotStage = new plotStageModel({
    plotId: plot_id,
    paymentId: nextPayObj._id,
    user_id: user_id,
    stage: currentStage,
    dealAmount: req.body.dealAmount,
    plotSize: showplot.plotSize,
    amountPerSqrYrd: showplot.amountPerSqYard,
    customerId: showCustomer._id,
    totalPaidAmount: total_paidAmount,
    percentTotalPay: percentPay,
    percentColorPay: percentColor,
    logDateModified: logDate
  });

  changePlotStage.save();

  const employdata = await adminModel.findOne(
    { _id: user_id },
    { firstName: 1, lastName: 1 }
  );

  const changePlot = await plotModel.updateOne(
    { _id: plot_id },
    {
      $set: {
        stage: currentStage,
        totalPaidAmount: total_paidAmount,
        dealAmount: req.body.dealAmount,
        amountPerSqYard: req.body.amountPerSqYard
          ? Math.floor(req.body.amountPerSqYard)
          : console.log("per sqYard older value"),
        balanceAmount: paymentRemain,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        paymentIds: nextPayObj._id,
        employeeId: user_id,
        employeeName: `${employdata.firstName} ${employdata.lastName}`,
        logDateModified: logDate,
        logDateModifiedMill: logDateMilli,
        status: true
      }
    },
    { new: true }
  );

  let stageNextData = {
    percentPay: percentPay
  };

  return stageNextData;
}

// free plot again for sale...100000000000000000000000
exports.freePlotForSale = async function (req, res) {
  // try {
  let logDate = new Date().toISOString().slice(0, 10);
  let logDateMilli = Date.now();
  const plot_id = req.params.id;

  const usserr = await adminModel.findById(
    { _id: req.userId },
    { firstName: 1, lastName: 1 }
  );

  const showplot = await plotModel.findOne(
    { _id: plot_id },
    {
      customerId: 1,
      paymentIds: 1,
      plotSize: 1,
      amountPerSqYard: 1,
      dealAmount: 1
    }
  );

  const show_customer = await customerModel.findOne({
    _id: showplot.customerId,
    plotId: plot_id,
    status: true
  });

  const showlastpayment = await paymentModel
    .findOne(
      { plotId: plot_id, customerId: showplot.customerId },
      {
        plotId: 1,
        dealAmount: 1,
        dealDate: 1,
        totalAmount: 1,
        totalPaidAmount: 1,
        percentTotalPay: 1,
        percentColorPay: 1,
        numberOfInstallment: 1
      }
    )
    .sort({ createdAt: -1 });

  const addLastPlotStage = new plotStageModel({
    plotId: plot_id,
    plotSize: showplot.plotSize,
    paymentId: showlastpayment._id,
    customerId: show_customer._id,
    user_id: req.userId,
    dealAmount: showlastpayment.dealAmount,
    totalPaidAmount: showlastpayment.totalPaidAmount,
    percentTotalPay: showlastpayment.percentTotalPay,
    percentColorPay: showlastpayment.percentColorPay,
    logDateModified: new Date().toISOString().slice(0, 10),
    remark: req.body.remark,
    date: req.body.date,
    isPlotCancel: "Yes",
    settleAmount: req.body.settleAmount,
    settlePerson: req.body.settlePerson
  });

  addLastPlotStage.save();

  const modifiedPlotSpace = await plotModel.updateOne(
    { _id: plot_id },
    {
      $set: {
        stage: 0,
        percentTotalPay: 0,
        totalPaidAmount: 0,
        dealAmount: 0,
        customerName: "",
        customerPhone: "",
        employeeId: req.userId,
        employeeName: `${usserr.firstName} ${usserr.lastName}`,
        modifiedBy: req.userId,
        logDateModified: new Date().toISOString().slice(0, 10),
        logDateModifiedMill: logDateMilli,
        status: false,
        remark: "",
        settleAmount: req.body.settleAmount,
        percentColorPay: "#FFFF00" // yellow
      }
    }
  );

  const modifycustomer = await customerModel.updateMany(
    { _id: showplot.customerId, plotId: plot_id },
    {
      $set: {
        status: false
      }
    },
    { multi: true }
  );

  const modifypayment = await paymentModel.updateMany(
    {
      plotId: plot_id,
      customerId: show_customer._id
    },
    {
      $set: {
        chequeStatus: "cancelled",
        isPayinitiated: false,
        debitAmount: req.body.settleAmount,
        date: new Date().toISOString().slice(0, 10)
      }
    },
    { multi: true }
  );

  // const freePlotPayObj = new paymentModel({
  //   plotId: plot_id,
  //   totalAmount: showlastpayment.totalAmount,
  //   customerId: show_customer ? show_customer._id : "",
  //   date: logDate,
  //   payMode: req.body.payMode,
  //   checkNumber: req.body.checkNumber,
  //   checkValidDate: req.body.checkValidDate,
  //   accountName: req.body.accountName,
  //   accountNumber: req.body.accountNumber,
  //   stage: 0,
  //   paidAmount: 0,
  //   debitAmount: req.body.settleAmount,
  //   totalPaidAmount: 0,
  //   balanceAmount: 0,
  //   numberOfInstallment: showlastpayment.numberOfInstallment,
  //   nextInstallmentDate: "",
  //   chequeStatus: "cancelled",
  //   isPayinitiated: false,
  //   dealAmount: showplot.dealAmount,
  //   dealDate: "",
  //   totalPaidAmount: showlastpayment.totalPaidAmount,
  //   percentTotalPay: showlastpayment.percentTotalPay,
  //   percentColorPay: showlastpayment.percentColorPay
  // });

  // freePlotPayObj.save();

  res.status(200).json({ message: "Plot space made empty for sale" });
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// delete / remove complete plot
exports.removePlot = async function (req, res) {
  try {
    const userrr = await adminModel.findOne({ _id: req.userId }, { role: 1 });

    if (userrr.role == "superadmin") {
      const removeResult = await plotModel.findByIdAndDelete({
        _id: req.params.id
      });

      if (removeResult) {
        res.status(200).json({ message: "Plot removed successfully" });
      } else {
        res.status(400).json({ message: "No plot found" });
      }
    } else {
      res.status(400).json({ message: "Invalid authorization" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

// get all cheque payments
exports.getAllCheckPay = async function (req, res) {
  try {
    let paymentArr = [];

    const showpaymentsResult = await paymentModel
      .find({ payMode: "cheque" })
      .sort({ createdAt: -1 });

    // console.log(showpaymentsResult)

    let paymentResult = [];
    let i = 0;

    await Promise.all(
      showpaymentsResult.map(async (val) => {
        const plotdata = await plotModel.findOne(
          { _id: val.plotId },
          { _id: 1, plotNumber: 1 }
        );

        const customerdata = await customerModel.findOne(
          { plotId: val.plotId },
          { _id: 1, firstName: 1, lastName: 1 }
        );

        const paydata = await paymentModel.findOne(
          { checkNumber: val.checkNumber },
          {
            checkNumber: 1,
            checkValidDate: 1,
            accountName: 1,
            accountNumber: 1,
            paidAmount: 1,
            remark: 1,
            isPayinitiated: 1
          }
        );

        paymentResult[i] = {};
        paymentResult[i].plotId = plotdata ? plotdata._id : "";
        paymentResult[i].checkNumber = paydata.checkNumber;
        paymentResult[i].checkValidDate = paydata.checkValidDate;
        paymentResult[i].accountName = paydata.accountName;
        paymentResult[i].accountNumber = paydata.accountNumber;
        paymentResult[i].paidAmount = paydata.paidAmount;
        paymentResult[i].plotNumber = plotdata ? plotdata.plotNumber : "";
        paymentResult[i].customerName = customerdata
          ? `${customerdata.firstName} ${customerdata.lastName}`
          : "";
        paymentResult[i].remark = paydata.remark;
        paymentResult[i].isPayinitiated = paydata.isPayinitiated;

        i++;
      })
    );

    res.status(200).json({ message: "Success", paymentResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// cancel cheque
exports.cancelCheque = async function (req, res) {
  //  try {
  const user_id = req.userId;
  const plot_id = req.params.id;
  const check_num = req.params.checkNum;

  const showPlot = await plotModel.findOne(
    { _id: req.params.id },
    { stage: 1, totalAmount: 1 }
  );
  let stage = showPlot.stage.toString();
  console.log("showPlot");
  console.log(showPlot);
  console.log(stage);

  switch (stage) {
    case "1":
      // const stageZero = await plotStageZeroCancelCheck(
      //   user_id,
      //   plot_id,
      //   check_num,
      //   req
      // );

      // // count++;
      // res.status(stageZero.code).json({ message: stageZero.msg });
      // break;

      const stageZero = await plotStageZeroCancelCheck(
        user_id,
        plot_id,
        check_num,
        req
      );
      console.log(stageZero);
      const prevPay = await paymentModel
        .findOne({ plotId: plot_id, checkNumber: check_num }, { _id: 1 })
        .sort({ createdAt: -1 });
      const modifyinitialPayPercent = await paymentModel.updateOne(
        { _id: prevPay._id },
        {
          $set: {
            percentTotalPay: stageZero.percentPay,
            percentColorPay: stageZero.percentPayColor
          }
        },
        { new: true }
      );
      res.status(200).json({ message: "cheque cancelled successfully" });
      break;
    case "2":
    case "3":
    case "4":
    case "5":
      const stageNext = await plotStageNextCancelCheck(
        user_id,
        plot_id,
        check_num,
        req
      );
      console.log(stageNext);
      const newPay = await paymentModel
        .findOne({ plotId: plot_id, checkNumber: check_num }, { _id: 1 })
        .sort({ createdAt: -1 });
      const modifyNextPayPercent = await paymentModel.updateOne(
        { _id: newPay._id },
        {
          $set: {
            percentTotalPay: stageNext.percentPay,
            percentColorPay: stageNext.percentPayColor
          }
        },
        { new: true }
      );

      res.status(200).json({ message: "updated successfully" });
      break;
    // default:
    //   res.status(400).json({ message: "Cheque is already cancelled" });
  }
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// async function plotStageZeroCancelCheck(user_id, plot_id, check_num, req) {
//   const usserr = await adminModel.findById(
//     { _id: user_id },
//     { firstName: 1, lastName: 1 }
//   );

//   const plotdata = await plotModel.findOne(
//     { _id: plot_id },
//     { totalAmount: 1 }
//   );

//   const showlastPlotStage = await plotStageModel
//     .findOne({ plotId: plot_id }, { _id: 1 })
//     .sort({ createdAt: -1 });

//   const showlastpayment = await paymentModel
//     .findOne(
//       { plotId: plot_id, checkNumber: check_num },
//       {
//         plotId: 1,
//         dealAmount: 1,
//         dealDate: 1,
//         totalPaidAmount: 1,
//         percentTotalPay: 1,
//         percentColorPay: 1
//       }
//     )
//     .sort({ createdAt: -1 });

//   const updateLastPlotStage = await plotStageModel.updateOne(
//     { _id: showlastPlotStage._id },
//     {
//       $set: {
//         paymentId: showlastpayment._id,
//         user_id: req.user_id,
//         dealAmount: showlastpayment.dealAmount,
//         totalPaidAmount: showlastpayment.totalPaidAmount,
//         percentTotalPay: showlastpayment.percentTotalPay,
//         percentColorPay: showlastpayment.percentColorPay,
//         logDateModified: new Date().toISOString().slice(0, 10),
//         remark: req.body.remark,
//         date: req.body.date,
//         settleAmount: req.body.settleAmount,
//         settlePerson: req.body.settlePerson
//       }
//     }
//   );

//   let logDateMilli = Date.now();

//   const modifiedPlotSpace = await plotModel.updateOne(
//     { _id: plot_id },
//     {
//       $set: {
//         stage: 0,
//         percentTotalPay: 0,
//         customerId: "1000000000a0000000000201",
//         customerName: "",
//         customerPhone: "",
//         employeeId: user_id,
//         employeeName: `${usserr.firstName} ${usserr.lastName}`,
//         modifiedBy: user_id,
//         logDateModified: new Date().toISOString().slice(0, 10),
//         logDateModifiedMill: logDateMilli,
//         status: false,
//         totalPaidAmount: 0,
//         dealAmount: 0,
//         balanceAmount: plotdata.totalAmount,
//         paymentIds: "100000000c00000000000202",
//         percentColorPay: "#FFFF00" // yellow
//       }
//     }
//   );

//   const modifycustomer = await customerModel.updateMany(
//     { plotId: plot_id },
//     {
//       $set: {
//         status: false
//       }
//     },
//     { new: true }
//   );

//   const modifypayment = await paymentModel.updateMany(
//     {
//       checkNumber: check_num
//     },
//     {
//       $set: {
//         remark: req.body.remark,
//         date: new Date().toISOString().slice(0, 10),
//         isPayinitiated: false
//       }
//     },
//     { new: true }
//   );
//   let stageZeroData = {
//     code: 200,
//     msg: "Cheque cancelled successfully"
//   };

//   return stageZeroData;
// }

async function plotStageZeroCancelCheck(user_id, plot_id, check_num, req) {
  // console.log(plot_id);
  // console.log(check_num);
  const showplot = await plotModel.findOne({ _id: plot_id });

  const showCustomer = await customerModel.findOne({
    plotId: plot_id,
    status: true
  });

  const showlastPay = await paymentModel
    .findOne(
      { plotId: plot_id, checkNumber: check_num },
      { totalPaidAmount: 1, dealAmount: 1, dealDate: 1, paidAmount: 1 }
    )
    .sort({ createdAt: -1 });

  console.log(showlastPay);

  let total_paidAmount = showlastPay.totalPaidAmount - showlastPay.paidAmount;

  console.log(total_paidAmount);

  let paymentRemain = showlastPay.dealAmount - total_paidAmount;

  let pay = total_paidAmount / showlastPay.dealAmount;

  let percentPay = Math.floor(pay * 100);

  let percentColor;
  let currentStage;

  if (percentPay > 1 && percentPay <= 25) {
    percentColor = "#00FF00"; // Green
    currentStage = 1;
  } else if (percentPay > 25 && percentPay <= 50) {
    percentColor = "#FFA500"; // Orange
    currentStage = 2;
  } else if (percentPay > 50 && percentPay <= 75) {
    percentColor = "#ADD8E6"; // Blue
    currentStage = 3;
  } else if (percentPay > 75 && percentPay <= 99) {
    percentColor = "#C8C8C8"; // Light Gray
    currentStage = 4;
  } else if (percentPay >= 100) {
    percentColor = "#880ED49C"; // Violet
    currentStage = 5;
  } else {
    currentStage = 0;
    percentColor = "#FFFF00"; // Yellow
    console.log("No color");
  }

  console.log(percentPay);

  let logDate = new Date().toISOString().slice(0, 10);
  let logDateMilli = Date.now();

  const modifyCurrentPay = await paymentModel.updateOne(
    { _id: showlastPay._id, checkNumber: check_num },
    {
      $set: {
        dealAmount: showlastPay.dealAmount,
        dealDate: showlastPay.dealDate,
        totalPaidAmount: total_paidAmount,
        balanceAmount: paymentRemain,
        stage: currentStage,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        remark: req.body.remark,
        date: logDate,
        chequeStatus: "cancelled",
        isPayinitiated: false
      }
    },
    { new: true }
  );

  const changePlotStage = await plotStageModel.updateOne(
    { plotId: plot_id },
    {
      $set: {
        paymentId: showlastPay._id,
        user_id: user_id,
        stage: currentStage,
        dealAmount: showlastPay.dealAmount,
        totalPaidAmount: total_paidAmount,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        logDateModified: logDate
      }
    },
    { new: true }
  );

  const employdata = await adminModel.findOne(
    { _id: user_id },
    { firstName: 1, lastName: 1 }
  );

  const payments = await paymentModel
    .find({
      _id: showlastPay._id,
      checkNumber: check_num,
      isPayinitiated: true
    })
    .countDocuments();

  switch (payments) {
    case 1:
      const changePlot = await plotModel.updateOne(
        { _id: plot_id },
        {
          $set: {
            stage: currentStage,
            totalPaidAmount: total_paidAmount,
            balanceAmount: paymentRemain,
            percentTotalPay: percentPay,
            percentColorPay: percentColor,
            paymentIds: showlastPay._id,
            employeeId: user_id,
            employeeName: `${employdata.firstName} ${employdata.lastName}`,
            logDateModified: logDate,
            logDateModifiedMill: logDateMilli,
            status: true,
            customerName: "",
            customerPhone: "",
            customerId: null,
            status: false
          }
        },
        { new: true }
      );
      break;
    case payments > 1:
      const changePlots = await plotModel.updateOne(
        { _id: plot_id },
        {
          $set: {
            stage: currentStage,
            totalPaidAmount: total_paidAmount,
            balanceAmount: paymentRemain,
            percentTotalPay: percentPay,
            percentColorPay: percentColor,
            paymentIds: showlastPay._id,
            employeeId: user_id,
            employeeName: `${employdata.firstName} ${employdata.lastName}`,
            logDateModified: logDate,
            logDateModifiedMill: logDateMilli,
            status: true
          }
        },
        { new: true }
      );
  }

  let stageNextData = {
    percentPay: percentPay,
    percentPayColor: percentColor
  };

  return stageNextData;
}

async function plotStageNextCancelCheck(user_id, plot_id, check_num, req) {
  // console.log(plot_id);
  // console.log(check_num);
  const showplot = await plotModel.findOne({ _id: plot_id });

  const showCustomer = await customerModel.findOne({
    plotId: plot_id,
    status: true
  });

  const showlastPay = await paymentModel
    .findOne(
      { plotId: plot_id, checkNumber: check_num },
      { totalPaidAmount: 1, dealAmount: 1, dealDate: 1, paidAmount: 1 }
    )
    .sort({ createdAt: -1 });

  let total_paidAmount = showlastPay.totalPaidAmount - showlastPay.paidAmount;

  console.log(total_paidAmount);

  let paymentRemain = showlastPay.dealAmount - total_paidAmount;

  let pay = total_paidAmount / showlastPay.dealAmount;

  let percentPay = Math.floor(pay * 100);

  let percentColor;
  let currentStage;

  if (percentPay > 1 && percentPay <= 25) {
    percentColor = "#00FF00"; // Green
    currentStage = 1;
  } else if (percentPay > 25 && percentPay <= 50) {
    percentColor = "#FFA500"; // Orange
    currentStage = 2;
  } else if (percentPay > 50 && percentPay <= 75) {
    percentColor = "#ADD8E6"; // Blue
    currentStage = 3;
  } else if (percentPay > 75 && percentPay <= 99) {
    percentColor = "#C8C8C8"; // Light Gray
    currentStage = 4;
  } else if (percentPay >= 100) {
    percentColor = "#880ED49C"; // Violet
    currentStage = 5;
  } else {
    currentStage = 0;
    percentColor = "#FFFF00"; // Yellow
    console.log("No color");
  }

  console.log(percentPay);

  let logDate = new Date().toISOString().slice(0, 10);
  let logDateMilli = Date.now();

  const modifyCurrentPay = await paymentModel.updateOne(
    { _id: showlastPay._id, checkNumber: check_num },
    {
      $set: {
        dealAmount: showlastPay.dealAmount,
        dealDate: showlastPay.dealDate,
        totalPaidAmount: total_paidAmount,
        balanceAmount: paymentRemain,
        stage: currentStage,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        remark: req.body.remark,
        date: logDate,
        chequeStatus: "cancelled",
        isPayinitiated: false
      }
    },
    { new: true }
  );

  const changePlotStage = await plotStageModel.updateOne(
    { plotId: plot_id },
    {
      $set: {
        paymentId: showlastPay._id,
        user_id: user_id,
        stage: currentStage,
        dealAmount: showlastPay.dealAmount,
        totalPaidAmount: total_paidAmount,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        logDateModified: logDate
      }
    },
    { new: true }
  );
  const employdata = await adminModel.findOne(
    { _id: user_id },
    { firstName: 1, lastName: 1 }
  );

  const payments = await paymentModel
    .find({ plotId: plot_id, isPayinitiated: true })
    .countDocuments();
  const pays = payments.toString();
  console.log(pays);
  console.log("pays");
  switch (pays) {
    case "1":
      const changePlot = await plotModel.updateOne(
        { _id: plot_id },
        {
          $set: {
            stage: currentStage,
            totalPaidAmount: total_paidAmount,
            balanceAmount: paymentRemain,
            percentTotalPay: percentPay,
            percentColorPay: percentColor,
            paymentIds: showlastPay._id,
            employeeId: user_id,
            employeeName: `${employdata.firstName} ${employdata.lastName}`,
            logDateModified: logDate,
            logDateModifiedMill: logDateMilli,
            status: true,
            customerName: "",
            customerPhone: "",
            customerId: null,
            status: false
          }
        },
        { new: true }
      );
      break;
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "10":
    case "11":
    case "12":
    case "13":
    case "14":
    case "15":
      const changePlots = await plotModel.updateOne(
        { _id: plot_id },
        {
          $set: {
            stage: currentStage,
            totalPaidAmount: total_paidAmount,
            balanceAmount: paymentRemain,
            percentTotalPay: percentPay,
            percentColorPay: percentColor,
            paymentIds: showlastPay._id,
            employeeId: user_id,
            employeeName: `${employdata.firstName} ${employdata.lastName}`,
            logDateModified: logDate,
            logDateModifiedMill: logDateMilli,
            status: true
          }
        },
        { new: true }
      );
      break;
  }

  let stageNextData = {
    percentPay: percentPay,
    percentPayColor: percentColor
  };

  return stageNextData;
}

// excel file plot details bulk upload
// middleware for uploading the Excel sheets data into mongodb collection
const excelDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/excel");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const excelDocMaxSize = 100 * 1024 * 1024;
exports.upload_excelDocuments = multer({
  storage: excelDocStorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(xlsx|xls|csv)$/)) {
      cb(null, true);
    } else {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
    }
  },
  limits: { fileSize: excelDocMaxSize }
});
