const BookingModel = require("../../model/booking");
const camr = require("../../model/car");
const carModel = require("../../model/carModel");
const carBrandModel = require("../../model/carBrand");
const carPriceMOdel = require("../../model/carprice");
const carprice = require("../../model/carprice");
const paymentMOdel = require("../../model/payment");
const customerModel = require("../../model/customer");
const securityDepositModel = require("../../model/securityDeposit");

exports.addBooking = async function (req, res) {
  // try {
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

  const custUser = await customerModel.findOne(
    { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
    { _id: 1, customerName: 1, email: 1, phone: 1, password: 1, isBlocked: 1 }
  );

  // const car = await camr.findOne({ _id: req.body.carId });

  // console.log(car);
  // const carbrand = await carBrandModel.findOne({ _id: car.carBrandId });

  //const carPrice = await carPriceMOdel.findOne({_id: req.body.carPriceId});

  // let condition = {};
  // let getvariables = { _id: 1, kms: 1 };
  // condition.carId = req.body.carId;
  // condition.id = req.body.carPriceId;
  // switch (req.body.timeSlot) {
  //   case "6":
  //     condition.sixHoursprice != "";
  //     getvariables.price = "$sixHoursprice";
  //     break;
  //   case "12":
  //     condition.tweleveHoursprice != "";
  //     getvariables.price = "$tweleveHoursprice";
  //     break;
  //   case "one":
  //     condition.onedayPrice != "";
  //     getvariables.price = "$onedayPrice";
  //     break;
  // }
  //const carPrice = await carPriceMOdel.findOne(condition,getvariables);

  // console.log("carPrice");
  // const carmodel = await carModel.findOne({ _id: car.carModelId });
  // console.log(carmodel);

  let logDate = new Date().toISOString();

  let todaye = new Date().toISOString().slice(0, 10);

  //var datesCOunt = datediff(req.body.fromDate, req.body.toDate);

  // var payments = {};
  // var deposite = {};

  //var gst=((carPrice.price*datesCOunt)*1)/100;
  const bookingObj = new BookingModel({
    //carId: req.body.carId,
    //customerName: custUser ? custUser.customerName : "",
    phone: req.body.phone,
    email: req.body.email,
    // carType: req.body.carType,
    booking_id: cId,
    customerId: req.body.customerId,
    drivepoints: "0",
    // carModelId: car.carModelId,
    // carModelName: carmodel.model_name,
    // fromDate: req.body.fromDate,
    // toDate: req.body.toDate,
    // carPriceId: req.body.carPriceId,
    // timeSlot: req.body.timeSlot,
    // price: req.body.price,
    // gst: req.body.gst,
    // transactionCharges: req.body.transactionCharges,
    // totalprice: req.body.totalprice,
    // couponCode: req.body.couponCode,
    // couponId: null,
    // paymentStatus: req.body.paymentStatus,
    // securityDepositStatus: req.body.securityDepositStatus
    //   ? req.body.securityDepositStatus
    //   : 0,
    // securityDepositReturn: req.body.securityDepositReturn
    //   ? req.body.securityDepositReturn
    //   : 0,
    date: todaye,
    logDateCreated: logDate,
    status: "pending",
    reason: ""
  });
  bookingObj.save(function (er, data) {
    if (er) {
      res.status(400).json({
        success: false,
        message: "Booking could not be done",
        Error: er
      });
    }
    // if (data) {
    //   payments.bookingId = data._id;
    //   payments.customerId = custUser ? custUser._id : "";
    //   payments.paymentStatus = req.body.paymentStatus;
    //   payments.paymethod = "cash";
    //   payments.price = req.body.price;
    //   payments.gst = req.body.gst;
    //   payments.transactionCharges = req.body.transactionCharges;
    //   payments.discountPrice = 0;
    //   payments.totalprice = req.body.totalprice;
    //   payments.balanceAmount = req.body.balanceAmount;
    //   payments.couponCode = req.body.couponCode;
    //   payments.couponId = null;
    //   payments.date = todaye;
    //   payments.logDateCreated = logDate;
    //   payments.logDateModified = null;
    //   payments.transactionId = null;

    //   const paymnetbs = new paymentMOdel(payments).save();

    //   deposite.bookingId = data._id;
    //   deposite.customerId = data.customerId;
    //   deposite.customerName = data.customerName;
    //   // deposite.customerName = data.customerName;
    //   deposite.securityDepositStatus = req.body.securityDepositStatus
    //     ? req.body.securityDepositStatus
    //     : 0;
    //   deposite.securityDepositReturn = req.body.securityDepositReturn
    //     ? req.body.securityDepositReturn
    //     : 0;
    //   deposite.securityDeposite = req.body.securityDeposite;
    //   deposite.RegistNumber = req.body.RegistNumber;
    //   deposite.RegistImage = req.file ? req.file.path : console.log("No Img");
    //   deposite.depositeAmount = req.body.depositeAmount
    //     ? req.body.depositeAmount
    //     : "0";
    //   deposite.logDateCreated = logDate;
    //   deposite.logDateModified = logDate;

    //   const securityDeposit = new securityDepositModel(deposite).save();
    else{
      res.status(200).json({
      success: true,
      message: "Booking added successfully",
      data: data
    })}
      
    }
  //}
  );
  // } catch (err) {
  //   res
  //     .status(400)
  //     .json({ success: false, message: "Something went wrong..!" });
  // }
};

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

// get car price by car id and package
exports.getcarprice = async function (req, res) {
  try {
    const { carId, timeSlot } = req.body;
    let condition = {};
    let getvariables = { _id: 1, kms: 1 };
    condition.carId = carId;
    switch (timeSlot) {
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
    const carPrice = await carPriceMOdel.find(condition, getvariables);
    res.status(200).json({
      success: true,
      message: "Completed successfully",
      data: carPrice
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong..!" });
  }
};

// get all bookings
exports.getAllBookings = async function (req, res) {
  // try {
  let condition = {};
  console.log(req.body);
  const { toDate, fromDate, status } = req.body;
  if (status != "All") {
    condition.status = status;
  }
  if (fromDate != "" && toDate != "") {
    condition.date = { $gte: fromDate, $lte: toDate };
  }

  condition.isActive = true;

  console.log(condition);
  const bookingSearchResult = await BookingModel.find(condition).sort({
    logDateCreated: -1
  });

  res.status(200).json({ message: "Success", bookingSearchResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// get all panding bookings
exports.getAllPendingBookings = async function (req, res) {
  // try {
  let condition = {};
  console.log(req.body);
  const { toDate, fromDate } = req.body;
  condition.status = "pending";

  if (fromDate != "" && toDate != "") {
    condition.date = { $gte: fromDate, $lte: toDate };
  }

  condition.isActive = true;

  console.log(condition);
  const pendingBookingResult = await BookingModel.find(condition).sort({
    logDateCreated: -1
  });

  res.status(200).json({ message: "Success", pendingBookingResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// get all accepted bookings
exports.getAllAcceptedBookings = async function (req, res) {
  // try {
  let condition = {};
  console.log(req.body);
  const { toDate, fromDate } = req.body;
  condition.status = "accepted";

  if (fromDate != "" && toDate != "") {
    condition.date = { $gte: fromDate, $lte: toDate };
  }

  condition.isActive = true;

  console.log(condition);
  const acceptedBookingResult = await BookingModel.find(condition).sort({
    logDateCreated: -1
  });

  res.status(200).json({ message: "Success", acceptedBookingResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// get all cancelled bookings
exports.getAllCancelledBookings = async function (req, res) {
  // try {
  let condition = {};
  console.log(req.body);
  const { toDate, fromDate } = req.body;
  condition.status = "cancelled";

  if (fromDate != "" && toDate != "") {
    condition.date = { $gte: fromDate, $lte: toDate };
  }

  condition.isActive = true;

  console.log(condition);
  const cancelledBookingResult = await BookingModel.find(condition).sort({
    logDateCreated: -1
  });

  res.status(200).json({ message: "Success", cancelledBookingResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// get all completed bookings
exports.getAllCompletedBookings = async function (req, res) {
  // try {
  let condition = {};
  console.log(req.body);
  const { toDate, fromDate } = req.body;
  condition.status = "completed";

  if (fromDate != "" && toDate != "") {
    condition.date = { $gte: fromDate, $lte: toDate };
  }

  condition.isActive = true;

  console.log(condition);
  const completedBookingResult = await BookingModel.find(condition).sort({
    logDateCreated: -1
  });

  res.status(200).json({ message: "Success", completedBookingResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// update booking
exports.editBooking = async function (req, res) {
  // try {
  const custUser = await customerModel.findOne(
    { $or: [{ email: req.body.email }, { phone: req.body.phone }] },
    { _id: 1, customerName: 1, email: 1, phone: 1, password: 1, isBlocked: 1 }
  );

  const car = await camr.findOne({ _id: req.body.carId });

  console.log(car);

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

  const changeBooking = await BookingModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        carId: req.body.carId,
        customerName: custUser ? custUser.customerName : "",
        phone: req.body.phone,
        email: req.body.email,
        carType: car.carType,
        customerId: custUser ? custUser._id : "",
        drivepoints: "0",
        carModelId: car.carModelId,
        carModelName: carmodel.model_name,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        carPriceId: req.body.carPriceId,
        timeSlot: req.body.timeSlot,
        price: req.body.price,
        totalprice: req.body.totalprice,
        paymentStatus: req.body.paymentStatus,
        securityDepositStatus: req.body.securityDepositStatus
          ? req.body.securityDepositStatus
          : 0,
        securityDepositReturn: req.body.securityDepositReturn
          ? req.body.securityDepositReturn
          : 0,
        date: todaye,
        logDateCreated: logDate,
        logDateModified: logDate,
        status: "pending",
        reason: ""
      }
    },
    { new: true }
  );

  // const changePay = await paymentMOdel.updateOne(
  //   { bookingId: req.params.id },
  //   {
  //     $set: {
  //       customerId: custUser ? custUser._id : "",
  //       paymentStatus: req.body.paymentStatus,
  //       price: req.body.price,
  //       gst: req.body.gst,
  //       transactionCharges: req.body.transactionCharges,
  //       discountPrice: 0,
  //       totalprice: req.body.totalprice,
  //       couponCode: req.body.couponCode,
  //       couponId: null,
  //       date: todaye,
  //       logDateModified: logDate,
  //       transactionId: null
  //     }
  //   },
  //   { new: true }
  // );

  if (changePay) {
    res.status(200).json({
      success: true,
      message: "Booking updated successfully"
    });
  }
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};

// get booking details
exports.getBookingDetails = async function (req, res) {
  // try {
  const booking = await BookingModel.findOne(
    { _id: req.body._id }, // booking document id
    {
      _id: 1,
      customerName: 1,
      phone: 1,
      email: 1,
      carType: 1,
      booking_id: 1,
      carId: 1,
      customerId: 1,
      drivepoints: 1,
      carModelId: 1,
      carModelName: 1,
      fromDate: 1,
      toDate: 1,
      timeSlot: 1,
      carPriceId: 1,
      price: 1,
      totalprice: 1,
      securityDepositStatus: 1,
      securityDepositReturn: 1,
      date: 1,
      logDateCreated: 1,
      logDateModified: 1,
      status: 1,
      reason: 1
    }
  );

  const paydetail = await paymentMOdel.find(
    { bookingId: req.body._id },
    {
      customerId: 1,
      price: 1,
      gst: 1,
      transactionCharges: 1,
      discountPrice: 1,
      totalprice: 1,
      balanceAmount: 1,
      couponCode: 1,
      couponId: 1,
      date: 1,
      logDateCreated: 1,
      logDateModified: 1,
      status: 1,
      transactionId: 1
    }
  );

  const depositDetails = await securityDepositModel.findOne(
    { bookingId: req.body._id },
    {
      securityDepositStatus: 1,
      securityDepositReturn: 1,
      securityDeposite: 1,
      RegistNumber: 1,
      RegistImage: 1,
      depositeAmount: 1,
      logDateCreated: 1
    }
  );

  let bookingResult = {
    _id: booking._id,
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    carType: booking.carType,
    booking_id: booking.booking_id,
    carId: booking.carId,
    customerId: booking.customerId,
    drivepoints: booking.drivepoints,
    carModelId: booking.carModelId,
    carModelName: booking.carModelName,
    fromDate: booking.fromDate,
    toDate: booking.toDate,
    timeSlot: booking.timeSlot,
    carPriceId: booking.carPriceId,
    price: booking.price,
    totalprice: booking.totalprice,
    bookingDate: booking.date,
    logDateCreated: booking.logDateCreated,
    logDateModified: booking.logDateModified,
    status: booking.status,
    reason: booking.reason,
    securityDepositStatus: depositDetails
      ? depositDetails.securityDepositStatus
      : "",
    securityDepositReturn: depositDetails
      ? depositDetails.securityDepositReturn
      : "",
    securityDeposite: depositDetails ? depositDetails.securityDeposite : "",
    RegistNumber: depositDetails ? depositDetails.RegistNumber : "",
    RegistImage: depositDetails ? depositDetails.RegistImage : "",
    depositeAmount: depositDetails ? depositDetails.depositeAmount : "",
    depositeDate: depositDetails ? depositDetails.logDateCreated : "",
    payments: paydetail
  };

  res.status(200).json({ message: "Success", bookingResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// Change drive points
exports.updateDrivePoints = async function (req, res) {
  try {
    let logDate = new Date().toISOString();
    const changedrivepoint = await BookingModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          drivepoints: req.body.drivepoints,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changedrivepoint) {
      res.status(200).json({ message: "Drive points updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// change booking status
exports.editBookingStatus = async function (req, res) {
  try {
    const changeStatus = await BookingModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          reason: req.body.reason
        }
      },
      { new: true }
    );

    if (changeStatus) {
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable booking
exports.disableBooking = async function (req, res) {
  try {
    const disableResult = await BookingModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isActive: false
        }
      },
      { new: true }
    );

    if (disableResult) {
      res.status(200).json({ message: "Booking disabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// enable booking
exports.enableBooking = async function (req, res) {
  try {
    const enableResult = await BookingModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isActive: true
        }
      },
      { new: true }
    );

    if (enableResult) {
      res.status(200).json({ message: "Booking enabled successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// add remaining amount for partial payments
exports.addPaymentByBookingid = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    let todaye = new Date().toISOString().slice(0, 10);

    const showBooking = await BookingModel.findOne(
      { _id: req.params.id },
      { customerId: 1 }
    );

    let payments = {};
    payments.bookingId = req.params.id;
    payments.customerId = showBooking ? showBooking.customerId : "";
    payments.paymentStatus = 1;
    payments.paymethod = "cash";
    payments.price = req.body.price;
    payments.gst = req.body.gst;
    payments.transactionCharges = 0;
    payments.discountPrice = 0;
    payments.totalprice = req.body.totalprice;
    payments.balanceAmount = req.body.balanceAmount;
    payments.couponCode = 0;
    payments.couponId = null;
    payments.date = todaye;
    payments.logDateCreated = logDate;
    payments.logDateModified = null;
    payments.transactionId = null;

    const paymnetbs = new paymentMOdel(payments).save();

    res.status(200).json({
      success: true,
      message: "Payment added successfully"
      // data: paymnetbs
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!", Error: err });
  }
};

// update return of the deposites
exports.editDeposite = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    let todaye = new Date().toISOString().slice(0, 10);

    const showBooking = await BookingModel.findOne(
      { _id: req.params.id },
      { customerId: 1, customerName: 1 }
    );

    const updateDeposite = await securityDepositModel.updateOne(
      { bookingId: req.params.id },
      {
        $set: {
          customerId: showBooking.customerId,
          customerName: showBooking.customerName,
          securityDepositReturn: req.body.securityDepositReturn,
          logDateModified: logDate
        }
      }
    );

    const updateBooking = await BookingModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          securityDepositReturn: req.body.securityDepositReturn,
          logDateModified: logDate
        }
      }
    );

    if (updateDeposite) {
      res
        .status(200)
        .json({ message: "Security deposit updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// add security deposite
exports.addSecurityDeposite = async function (req, res) {
  try {
    let logDate = new Date().toISOString();
    let bookingId = req.params.id; // booking doc id
    const showBooking = await BookingModel.findOne(
      { _id: bookingId },
      { customerId: 1, customerName: 1 }
    );
    let deposite = {};
    deposite.bookingId = bookingId;
    deposite.customerId = showBooking.customerId;
    deposite.customerName = showBooking.customerName;
    deposite.securityDepositStatus = req.body.securityDepositStatus
      ? req.body.securityDepositStatus
      : 1;
    deposite.securityDepositReturn = req.body.securityDepositReturn
      ? req.body.securityDepositReturn
      : 0;
    deposite.securityDeposite = req.body.securityDeposite;
    deposite.RegistNumber = req.body.RegistNumber;
    deposite.RegistImage = req.file ? req.file.path : console.log("No Img");
    deposite.depositeAmount = req.body.depositeAmount
      ? req.body.depositeAmount
      : "0";
    deposite.logDateCreated = logDate;
    deposite.logDateModified = logDate;

    const securityDeposit = new securityDepositModel(deposite).save(
      async function (er, data) {
        if (er) {
          return res
            .status(400)
            .json({ message: "Security deposit could not be added" });
        }
        if (data) {
          const updateBooking = await BookingModel.updateOne(
            { _id: bookingId },
            {
              $set: {
                securityDepositStatus: req.body.securityDepositStatus
                  ? req.body.securityDepositStatus
                  : 1,
                logDateModified: logDate
              }
            }
          );

          res
            .status(200)
            .json({ message: "Security deposite added successfully" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// update security deposite
exports.editSecurityDeposite = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const showBooking = await BookingModel.findOne(
      { _id: req.params.id },
      { customerId: 1, customerName: 1 }
    );

    const updateDeposite = await securityDepositModel.updateOne(
      { bookingId: req.params.id },
      {
        $set: {
          customerId: showBooking.customerId,
          customerName: showBooking.customerName,
          returnedDate: req.body.returnedDate,
          securityDepositReturn: req.body.securityDepositReturn,
          description: req.body.description,
          logDateModified: logDate
        }
      }
    );
    const updateBooking = await BookingModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          securityDepositReturn: req.body.securityDepositReturn,
          logDateModified: logDate
        }
      }
    );
    if (updateDeposite) {
      res
        .status(200)
        .json({ message: "Security deposit updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

