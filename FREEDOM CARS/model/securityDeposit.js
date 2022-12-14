const mongoose = require("mongoose");
const securityDeposit = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  customerName: {
    type: String
  },
  securityDepositStatus: {
    type: Number,
   // enum: [0, 1], //0 is no,1 is yes
    default: 0
  },
  securityDepositReturn: {
    type: Number,
   // enum: [0, 1], //0 is no,1 is yes
    default: 0
  },
  securityDeposite: {
    type: String,
    enum: ["bike", "laptop", "passport", "cash"]
  },
  RegistNumber: {
    type: String
  },
  RegistImage: {
    type: String,
    default: ""
  },
  depositeAmount: {
    type: String,
    default: "0"
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  }
});

module.exports = mongoose.model("securityDeposits", securityDeposit);
