const mongoose = require("mongoose");
const branch = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  branchManagerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId
  },
  superAdminName: {
    type: String
  },
  role: {
    type: String,
    default: "branchManager"
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  mapLink: {
    type: String,
    default: ""
  },
  carCount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("branchs", branch);
