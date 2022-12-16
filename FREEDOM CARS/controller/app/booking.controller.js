const BookingModel = require("../../model/booking");
const camr = require("../../model/car");
const carModel = require("../../model/carModel");
const carBrandModel = require("../../model/carBrand");
const carPriceMOdel = require("../../model/carprice");
const carprice = require("../../model/carprice");
const paymentMOdel = require("../../model/payment");
var mongoose = require("mongoose");
var couponsMOdel = require("../../model/coupon_model");

exports.addBooking = async function (req, res) {
  // try {
  console.log(req.body);
  let sumId;
  let cId;
  const count = await BookingModel.find().countDocuments();
  if (count > 0) {
    const data = await BookingModel.findOne().sort({ _id: -1 });
    let x = data.booking_id;
    let a = parseInt(x);
    sumId = a != undefined ? a + 00000001 : 00000001;
    cId = String(sumId).padStart(8, 0);
    console.log(cId);
  } else {
    sumId = 00000001;
    cId = String(sumId).padStart(8, 0);
    console.log(cId);
  }

  const car = await camr.findOne({ _id: req.body.carId });

  console.log(car);
  const carbrand = await carBrandModel.findOne({ _id: car.carBrandId });

  //const carPrice = await carPriceMOdel.findOne({_id: req.body.carPriceId});

  let condition = {};
  let getvariables = { _id: 1, kms: 1 };
  condition.carId = req.body.carId;
  condition.id = req.body.carPriceId;
  switch (req.body.timeSlot) {
    case "6":
      condition.sixHoursprice != "";
      getvariables.price = "$sixHoursprice";
      break;
    case "12":
      condition.tweleveHoursprice != "";
      getvariables.price = "$tweleveHoursprice";
      break;
    case "one":
      condition.onedayPrice != "";
      getvariables.price = "$onedayPrice";
      break;
  }
  //const carPrice = await carPriceMOdel.findOne(condition,getvariables);

  console.log("carPrice");
  const carmodel = await carModel.findOne({ _id: car.carModelId });
  console.log(carmodel);

  let logDate = new Date().toISOString();

  let todaye = new Date().toISOString().slice(0, 10);

  var datesCOunt = datediff(req.body.fromDate, req.body.toDate);

  var payments = {};

  //var gst=((carPrice.price*datesCOunt)*1)/100;
  const bookingObj = new BookingModel({
    carId: req.body.carId,
    customerName: req.body.customerName,
    phone: req.body.phone,
    email: req.body.email,
    carType: car.carType,
    booking_id: cId,
    customerId: req.userId,
    drivepoints: "0",
    carModelId: car.carModelId,
    carModelName: carmodel.model_name,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    carPriceId: req.body.carPriceId,
    timeSlot: req.body.timeSlot,
    price: req.body.price,
    totalprice: req.body.totalprice,
    date: todaye,
    logDateCreated: logDate,
    status: "pending",
    reason: "",
  });
  bookingObj.save(function (er, data) {
    if (er) {
      res.status(400).json({
        success: false,
        message: "Booking could not be done",
        Error: er,
      });
    }
    if (data) {
      payments.bookingId = data._id;
      payments.customerId = req.userId;
      payments.paymentStatus = req.body.paymentStatus;
      payments.price = req.body.price;
      payments.gst = req.body.gst;
      payments.transactionCharges = req.body.transactionCharges;
      payments.discountPrice = 0;
      payments.totalprice = req.body.totalprice;
      payments.couponCode = 0;
      payments.couponId = null;
      payments.date = todaye;
      payments.logDateCreated = logDate;
      payments.logDateModified = null;
      payments.transactionId = null;
      const paymnetbs = new paymentMOdel(payments).save();

      res.status(200).json({
        success: true,
        message: "Booking added successfully",
        data: data,
      });
    }
  });
  // } catch (err) {
  //   res
  //     .status(400)
  //     .json({ success: false, message: "Something went wrong..!" });
  // }
};

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

exports.getcarprice = async function (req, res) {
  try {
    const { carId, hrs } = req.body;
    let condition = {};
    let getvariables = { _id: 1, kms: 1 };
    condition.carId = carId;
    switch (hrs) {
      case "6":
        condition.sixHoursprice != "";
        getvariables.price = "$sixHoursprice";
        break;
      case "12":
        condition.tweleveHoursprice != "";
        getvariables.price = "$tweleveHoursprice";
        break;
      case "1":
        condition.onedayPrice != "";
        getvariables.price = "$onedayPrice";
        break;
    }
    const carPrice = await carPriceMOdel.find(condition, getvariables);
    res.status(200).json({
      success: true,
      message: "Completed successfully",
      data: carPrice,
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!" });
  }
};

exports.UpdatePayment = async function (req, res) {
  // try {
  const { transactionId, bookingId, paytype, status } = req.body;
  const counts = await BookingModel.findOne({
    _id: bookingId,
  }).countDocuments();
  console.log(counts);
  var result = "hello";
  switch (counts) {
    case 0:
      result = "0";
      break;
    case 1:
      result = await functionUpdate(transactionId, bookingId, paytype, status);
      break;
    default:
  }
  console.log("result");
  console.log(result);
  if (result == "1") {
    res
      .status(200)
      .json({ success: true, message: "Booking Successfully Completed" });
  } else if (result == "2") {
    res
      .status(200)
      .json({
        success: true,
        message: "Something went wrong.please try again",
      });
  } else if (result == "3") {
    res.status(200).json({ success: true, message: "Payment Failure" });
  } else {
    res.status(200).json({ success: true, message: "Invalid Booking Details" });
  }

  // } catch (err) {
  //   res
  //     .status(400)
  //     .json({ success: false, message: "Something went wrong..!" });
  // }
};

async function functionUpdate(transactionId, bookingId, paytype, status) {
  var success = "";
  switch (status) {
    case "success":
      const res = await BookingModel.updateOne(
        { _id: bookingId },
        {
          $set: {
            status: "accepted",
            logDateModified: new Date().toISOString(),
          },
        },
        { new: true }
      );
      var psysta = "";
      if (paytype == "0") {
        psysta = "partialcompleted";
      } else {
        psysta = "completed";
      }
      const res2 = await paymentMOdel.updateOne(
        { bookingId: bookingId },
        {
          $set: {
            status: psysta,
            transactionId: transactionId,
            logDateModified: new Date().toISOString(),
          },
        },
        { new: true }
      );

      if (res2) {
        success = "1";
      } else {
        success = "2";
      }
      break;
    case "failure":
      success = "3";
      break;
  }
  return success;
}

// get dashboard items
exports.getmybookings = async function (req, res) {
  try {
    let bookings = await BookingModel.aggregate([
      {
        $match: { customerId: mongoose.Types.ObjectId(req.userId) },
      },
      {
        $lookup: {
          from: "cars", // other table name
          localField: "carId", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "carsDetails", // alias for userinfo table
        },
      },
      { $unwind: "$carsDetails" },
      {
        $project: {
          _id: 1,
          booking_id: 1,
          customerId: 1,
          drivepoints: 1,
          carModelName: 1,
          fromDate: 1,
          toDate: 1,
          timeSlot: 1,
          price: 1,
          totalprice: 1,
          gst: 1,
          transactionCharges: 1,
          couponCode: 1,
          couponId: 1,
          date: 1,
          status: 1,
          paymentStatus: 1,
          securityDepositStatus: 1,
          cars: "$carsDetails",
          // seater:"$carmodels.noOfSeats",
        },
      },
    ]);
    res
      .status(200)
      .json({
        success: true,
        message: "completed successfully",
        bookings: bookings,
      });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!" });
  }
};

exports.getmyhistory = async function (req, res) {
  try {
    let bookings = await BookingModel.aggregate([
      {
        $match: { customerId: mongoose.Types.ObjectId(req.userId) },
      },
      {
        $lookup: {
          from: "cars", // other table name
          localField: "carId", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "carsDetails", // alias for userinfo table
        },
      },
      { $unwind: "$carsDetails" },
      {
        $project: {
          _id: 1,
          booking_id: 1,
          customerId: 1,
          drivepoints: 1,
          carModelName: 1,
          fromDate: 1,
          toDate: 1,
          timeSlot: 1,
          price: 1,
          totalprice: 1,
          gst: 1,
          transactionCharges: 1,
          couponCode: 1,
          couponId: 1,
          date: 1,
          status: 1,
          paymentStatus: 1,
          securityDepositStatus: 1,
          cars: "$carsDetails",
          // seater:"$carmodels.noOfSeats",
        },
      },
    ]);
    res
      .status(200)
      .json({
        success: true,
        message: "completed successfully",
        bookings: bookings,
      });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!" });
  }
};

exports.coupons = async function (req, res) {
  try {
    let todaye = new Date().toISOString().slice(0, 10);

    console.log(todaye);
    let condition = {
      from_date: {
        $lte: todaye,
      },
      to_date: {
        $gte: todaye,
      },
    };
    let coupons = await couponsMOdel.find(condition, {
      title: 1,
      coupon_code: 1,
      amount: 1,
      from_date: 1,
      to_date: 1,
      status: 1,
      description: 1,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "completed successfully",
        coupons: coupons,
      });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!" });
  }
};

// exports.drivepoints = async function (req, res) {
//  // try {
//     let sumpoints = await BookingModel.aggregate(
//       [{
//         "$match": { customerId: mongoose.Types.ObjectId(req.userId),}
//       },
//       {
//         $group:
//           {
//             _id:1,
//             totalpoints: { $sum: "$drivepoints" },
//             count: { $sum: 1 }
//           }
//       }
//       ]);

//     let points = await BookingModel.find(
//       { customerId: mongoose.Types.ObjectId(req.userId), },
//     { drivepoints: 1, logDateModified: 1, booking_id: 1 });

//     res.status(200).json({ success: true, sumpoints:sumpoints,message: "completed successfully", "points": points });
//  }
//   // catch (err) {
//   //   res
//   //     .status(400)
//   //     .json({ success: false, message: "Something went wrong..!" });
//   // }

// }

//get with sum of all drive points
exports.drivepoints = async (req, res) => {
  try {
    let sumpoints = await BookingModel.aggregate([
      { $match: { customerId: mongoose.Types.ObjectId(req.userId) } },

      {
        $group: {
          _id: { customerId: "$customerId" },
          totalpoints: { $sum: { $toInt: "$drivepoints" } },
          count: { $sum: 1 },
        },
      },
    ]);
    if (sumpoints) {
      res
        .status(200)
        .json({ success: true, message: "successfull retreived", sumpoints });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!" });
  }
};
