const mongoose = require("mongoose");
const booking = new mongoose.Schema({
  customerName: {
    type: String,
    //required: true,
    trim: true,
    index: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  carType: {
    type: String,
    enum: [
      "micro",
      "sedan",
      "hatchback",
      "universal",
      "liftback",
      "coupe",
      "suv",
      "crossover",
      "pickup",
      "van",
      "minivan",
      "minibus",
      "compactsuv",
      "mini",
      "miniprime",
      "sedanprime",
      "suvprime"
    ]
  },
  booking_id: {
    type: String,
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId
  },
  drivepoints: {
    type: String,
    enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    default: "0"
  },
  carModelId: {
    type: mongoose.Schema.Types.ObjectId
  },
  carModelName: {
    type: String
  },
  fromDate: {
    type: String
  },
  toDate: {
    type: String
  },
  timeSlot: {
    type: String,
    enum: ["6", "12", "one"],
    default: "one"
  },
  carPriceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  price: {
    type: String
  },
  gst: {
    type: String,
    default: "0"
  },
  transactionCharges: {
    type: String
  },
  totalprice: {
    type: String
  },
  couponCode: {
    type: String
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId
  },
  date: {
    type: String
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancelled", "completed"],
    default: "pending"
  },
  isActive: {
    type: Boolean,
    enum: [false, true],
    default: true
  },
  reason: {
    type: String
  },
  paymentStatus: {
    type: Number,
    //enum: [0, 1], //0 is partial,1 is full
  },
  securityDepositStatus: {
    type: Number,
    //enum: [0, 1], //0 is no,1 is yes
    default: 0
  },
  securityDepositReturn: {
    type: Number,
    //enum: [0, 1], //0 is no,1 is yes
    default: 0
  }
});

module.exports = mongoose.model("Bookings", booking);
