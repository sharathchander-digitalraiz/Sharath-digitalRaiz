const mongoose = require("mongoose");
const plotRegister = new mongoose.Schema(
  {
    plotId: {
      type: mongoose.Schema.Types.ObjectId
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId
    },
    customerName: {
      type: String
    },
    customerEmail: {
      type: String
    },
    customerPhone: {
      type: String
    },
    customerPresAddress: {
      type: String
    },
    customerPermAddress: {
      type: String
    },
    registoryStatus: {
      type: String,
      enum: ["pending", "inProgress", "completed"],
      default: "pending"
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

module.exports = mongoose.model("plotRegister", plotRegister);
