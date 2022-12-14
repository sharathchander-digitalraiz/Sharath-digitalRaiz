const bookingModel = require("../../model/booking");
const paymentModel = require("../../model/payment");

// get dashboard items
exports.getDashboardItems = async function (req, res) {
  //   try {
  let logDate = new Date().toISOString().slice(0, 10);

  /********************** Upcoming Bookings **************/
  const upcomingBooking = await bookingModel
    .find({ isActive: true, status: "accepted", fromDate: { $gt: logDate } })
    .countDocuments();

  /******************** Running Booking ****************/
  const runningBooking = await bookingModel
    .find({
      isActive: true,
      status: "accepted",
      fromDate: { $gte: logDate },
      toDate: { $lte: logDate }
    })
    .countDocuments();

  /******************* Completed Booking ******************/
  const completedBooking = await bookingModel
    .find({ isActive: true, status: "completed" })
    .countDocuments();

  let totaBooking = upcomingBooking + runningBooking + completedBooking;

  /***********************Pi chart *************/

  let bookingPiChart = [upcomingBooking, runningBooking, completedBooking];

  /********************** Booking table **************/
  let searchCodtion = new RegExp(req.query.searchQuery, "i");

  let docLimit = req.body.docLimit;

  const bookingList = await bookingModel
    .find({
      isActive: true,
      $or: [
        { booking_id: searchCodtion },
        { customerName: searchCodtion },
        { date: searchCodtion }
      ]
    })
    .sort({ logDateCreated: -1 })
    .limit(docLimit ? docLimit : 10);
  // let search = new RegExp(req.query.searchQuery, "i");

  // const bookingList = await bookingModel.find({
  //     $or: [
  //         {date: search},
  //         {status: search},
  //         {transactionId: search}
  //     ]
  // })

  res.status(200).json({
    message: "Success",
    upcomingBooking,
    runningBooking,
    completedBooking,
    totaBooking,
    bookingPiChart,
    bookingList
  });
  //   } catch (err) {
  //     res.status(400).json({ message: "Bad request" });
  //   }
};
