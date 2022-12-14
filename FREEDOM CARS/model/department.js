const mongoose = require("mongoose");
const department = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  branchName: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  adminName: {
    type: String
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("departments", department);
