const mongoose = require("mongoose");
const payment = new mongoose.Schema(
  {
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plots"
    },
    plotSize: {
      type: String
    },
    amountPerSqrYrd: {
      type: Number
    },
    totalAmount: {
      type: Number
    },
    dealAmount: {
      type: Number
    },
    dealDate: {
      type: String
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers"
    },
    date: {
      type: String
    },
    payMode: {
      type: String,
      enum: ["cheque", "cash"]
    },
    checkNumber: {
      type: String,
      required: false
    },
    checkValidDate: {
      type: String,
      required: false
    },
    accountName: {
      type: String,
      required: false
    },
    accountNumber: {
      type: String,
      required: false
    },
    stage: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
    },
    paidAmount: {
      type: Number,
      required: false
    },
    debitAmount: {
      type: Number,
      required: false
    },
    totalPaidAmount: {
      type: Number,
      default: 0
    },
    percentTotalPay: {
      type: Number,
      default: 0
    },
    percentColorPay: {
      type: String
    },
    balanceAmount: {
      type: Number
    },
    numberOfInstallment: {
      type: String
    },
    nextInstallmentDate: {
      type: String
    },
    chequeStatus: {
      type: String,
      enum: ["inProgress", "accepted", "cancelled"],
      default: "accepted"
    },
    isPayinitiated: {
      type: Boolean,
      enum: [false, true],
      default: false
    },
    remark: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("payments", payment);
