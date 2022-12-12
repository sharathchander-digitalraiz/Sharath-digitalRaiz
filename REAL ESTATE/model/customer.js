const mongoose = require("mongoose");
const customer = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      index: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    presentAddress: {
      type: String,
      minlength: [5, "Please enter at least 5 character"],
      required: true
    },
    permanentAddress: {
      type: String,
      minlength: [5, "Please enter at least 5 character"],
      required: true
    },
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plots",
      required: false
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: false
    },
    refName: {
      type: String,
      required: false,
      default: ""
    },
    refPhone: {
      type: String,
      required: false,
      default: ""
    },
    remark: {
      type: String,
      required: false,
      default: "Please write some remark here"
    },
    status: {
      type: Boolean,
      enum: [false, true],
      default: false
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("customers", customer);
