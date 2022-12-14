const mongoose = require("mongoose");
const plotStage = new mongoose.Schema(
  {
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plots"
    },
    plotSize: {
      type: String,
      default: ""
    },
    amountPerSqrYrd: {
      type: Number,
      default: 0
    },
    dealAmount: {
      type: Number,
      default: 0
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers"
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments"
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins"
    },
    stage: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
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
    logDateModified: {
      type: String
    },
    date: {
      type: String
    },
    remark: {
      type: String,
      default: ""
    },
    settleAmount: {
      type: String,
      default: 0
    },
    settlePerson: {
      type: String,
      default: ""
    },
    isPlotCancel: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("plotStages", plotStage);
