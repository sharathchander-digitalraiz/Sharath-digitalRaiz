const mongoose = require("mongoose");
const plot = new mongoose.Schema(
  {
    PlotSoftId: {
      type: String
    },
    plotNumber: {
      type: Number
    },
    phase: {
      type: String
    },
    area: {
      type: String
    },
    plotSize: {
      type: String
    },
    plotFace: {
      type: String
    },
    amountPerSqYard: {
      type: Number
    },
    totalAmount: {
      type: Number
    },
    dealAmount: {
      type: Number
    },
    totalPaidAmount: {
      type: Number,
      default: 0
    },
    balanceAmount: {
      type: Number,
      default: 0
    },
    stage: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
    },
    percentTotalPay: {
      type: Number,
      default: 0
    },
    percentColorPay: {
      type: String
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      default: null,
      required: false
    },
    customerName: {
      type: String,
      default: "",
      required: false
    },
    customerPhone: {
      type: String,
      default: "",
      required: false
    },
    paymentIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments",
      required: false
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: false
    },
    employeeName: {
      type: String,
      default: "",
      required: false
    },
    date: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins"
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins"
    },
    logDateCreated: {
      type: String
    },
    logDateModified: {
      type: String
    },
    logDateModifiedMill: {
      type: Number
    },
    status: {
      type: Boolean,
      enum: [false, true],
      default: false // cencelling the payment would make it false again
    },
    registoryStatus: {
      type: String,
      enum: ["pending", "inProgress", "completed"],
      default: "pending"
    },
    settleAmount: {
      type: Number,
      required: false
    },
    remark: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("plots", plot);
