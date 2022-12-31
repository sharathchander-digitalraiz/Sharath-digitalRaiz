const mongoose = require("mongoose");

const adminEmp = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    profilePic: {
      type: String,
    },
    designation: {
      type: String,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    departmentName: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    adminName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    logCreatedDate: {
      type: String,
    },
    logModifiedDate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminEmpes", adminEmp);
