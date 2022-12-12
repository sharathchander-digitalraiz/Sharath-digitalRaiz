const customerModel = require("../../model/customer");
const paymentModel = require("../../model/payment");
const plotModel = require("../../model/plot");

// edit perticular payment by id
exports.editPayment = async function (req, res) {
  // try {
  const showPay = await paymentModel
    .findOne(
      { _id: req.params.id },
      {
        dealAmount: 1,
        paidAmount: 1,
        totalPaidAmount: 1,
        percentTotalPay: 1,
        balanceAmount: 1
      }
    )
    .sort({ createdAt: -1 });

  // console.log(showPay.balanceAmount);

  let amountpay = showPay.paidAmount - req.body.paidAmount;

  // console.log(amountpay);

  let totapay = showPay.totalPaidAmount - amountpay;

  let totalPay = totapay / showPay.dealAmount;

  let percentPay = Math.floor(totalPay * 100);

  let balance = showPay.balanceAmount + amountpay;

  // console.log(percentPay);

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

  const changePay = await paymentModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        paidAmount: req.body.paidAmount,
        totalPaidAmount: totapay,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        stage: currentStage,
        balanceAmount: balance
      }
    },
    { new: true }
  );

  const plotdata = await plotModel.updateOne(
    { paymentIds: req.params.id },
    {
      $set: {
        paidAmount: req.body.paidAmount,
        totalPaidAmount: totapay,
        percentTotalPay: percentPay,
        percentColorPay: percentColor,
        stage: currentStage,
        balanceAmount: balance
      }
    },
    { new: true }
  );

  if (plotdata) {
    res.status(200).json({ message: "Payment updated successfully" });
  }
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};
