const bookingModel = require("../../model/booking");
const car = require("../../model/car");
const customer = require("../../model/customer");
const paymentModel = require("../../model/payment");
const securityDepositModel = require("../../model/securityDeposit");

// booking report
exports.carBookingReport = async function (req, res) {
  // try {
  let condition = {};

  const { toDate, fromDate, status } = req.body;
  if (status != "All") {
    condition.status = status;
  }
  if (fromDate != "" && toDate != "") {
    condition.date = { $gte: fromDate, $lte: toDate };
  }

  condition.isActive = true;

  console.log(condition);

  const bookingResult = await bookingModel.aggregate([
    {
      $match: condition
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "bookingId",
        as: "bookingpayJoin"
      }
    },
    {
      $lookup: {
        from: "securitydeposits",
        localField: "_id",
        foreignField: "bookingId",
        as: "bookingdepositJoin"
      }
    },
    {
      $unwind: {
        path: "$bookingdepositJoin",
        preserveNullAndEmptyArrays: true
      }
    },
    // { $unwind: "$bookingdepositJoin" },
    {
      $project: {
        _id: 1,
        customerId: 1,
        customerName: 1,
        phone: 1,
        email: 1,
        booking_id: 1,
        carId: 1,
        drivepoints: 1,
        carModelId: 1,
        carModelName: 1,
        fromDate: 1,
        toDate: 1,
        timeSlot: 1,
        carPriceId: 1,
        price: 1,
        gst: 1,
        transactionCharges: 1,
        totalprice: 1,
        couponCode: 1,
        couponId: 1,
        date: 1,
        logDateCreated: 1,
        status: 1,
        isActive: 1,
        reason: 1,
        securityDepositStatus: "$bookingdepositJoin.securityDepositStatus",
        securityDepositReturn: "$bookingdepositJoin.securityDepositReturn",
        securityDeposite: "$bookingdepositJoin.securityDeposite",
        RegistNumber: "$bookingdepositJoin.RegistNumber",
        RegistImage: "$bookingdepositJoin.RegistImage",
        depositeAmount: "$bookingdepositJoin.depositeAmount",
        payments: "$bookingpayJoin"
      }
    }
  ]);

  // const showBooking = await bookingModel
  //   .find(condition, {
  //     _id: 1,
  //     customerId: 1,
  //     customerName: 1,
  //     phone: 1,
  //     email: 1,
  //     booking_id: 1,
  //     carId: 1,
  //     drivepoints: 1,
  //     carModelId: 1,
  //     carModelName: 1,
  //     fromDate: 1,
  //     toDate: 1,
  //     timeSlot: 1,
  //     carPriceId: 1,
  //     price: 1,
  //     gst: 1,
  //     transactionCharges: 1,
  //     totalprice: 1,
  //     couponCode: 1,
  //     couponId: 1,
  //     date: 1,
  //     logDateCreated: 1,
  //     status: 1,
  //     isActive: 1,
  //     reason: 1
  //   })
  //   .sort({ logDateCreated: -1 });

  // let Mresult = [];
  // let i = 0;

  // await Promise.all(
  //   showBooking.map(async (val) => {
  //     let payData = await paymentModel.find({ bookingId: val._id }, {});

  //     const depoditData = await securityDepositModel.findOne(
  //       { bookingId: val._id },
  //       {
  //         securityDepositStatus: 1,
  //         securityDepositReturn: 1,
  //         securityDeposite: 1,
  //         RegistNumber: 1,
  //         RegistImage: 1,
  //         depositeAmount: 1
  //       }
  //     );

  //     Mresult[i] = {};
  //     Mresult[i]._id = val._id;
  //     Mresult[i].customerId = val.customerId;
  //     Mresult[i].customerName = val.customerName;
  //     Mresult[i].phone = val.phone;
  //     Mresult[i].email = val.email;
  //     Mresult[i].booking_id = val.booking_id;
  //     Mresult[i].carId = val.carId;
  //     Mresult[i].drivepoints = val.drivepoints;
  //     Mresult[i].carModelId = val.carModelId;
  //     Mresult[i].carModelName = val.carModelName;
  //     Mresult[i].fromDate = val.fromDate;
  //     Mresult[i].toDate = val.toDate;
  //     Mresult[i].timeSlot = val.timeSlot;
  //     Mresult[i].carPriceId = val.carPriceId;
  //     Mresult[i].price = val.price;
  //     Mresult[i].gst = val.gst;
  //     Mresult[i].transactionCharges = val.transactionCharges;
  //     Mresult[i].totalprice = val.totalprice;
  //     Mresult[i].couponCode = val.couponCode;
  //     Mresult[i].couponId = val.couponId;
  //     Mresult[i].date = val.date;
  //     Mresult[i].logDateCreated = val.logDateCreated;
  //     Mresult[i].status = val.status;
  //     Mresult[i].isActive = val.isActive;
  //     Mresult[i].reason = val.reason;
  //     Mresult[i].securityDepositStatus = depoditData
  //       ? depoditData.securityDepositStatus
  //       : "";
  //     Mresult[i].securityDepositReturn = depoditData
  //       ? depoditData.securityDepositReturn
  //       : "";
  //     Mresult[i].securityDeposite = depoditData
  //       ? depoditData.securityDeposite
  //       : "";
  //     Mresult[i].RegistNumber = depoditData ? depoditData.RegistNumber : "";
  //     Mresult[i].RegistImage = depoditData ? depoditData.RegistImage : "";
  //     Mresult[i].depositeAmount = depoditData ? depoditData.depositeAmount : "";
  //     Mresult[i].payments = payData;
  //   })
  // );
  res.status(200).json({ message: "Success", bookingResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};
