const mongoose = require("mongoose");
const document = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  customerName: {
    type: String
  },
  residentStatus: {
    type: String,
    enum: ["resident", "nonResident"],
    required: false
  },
  documentType: {
    type: String,
    enum: ["aadhar", "voterId", "passport"]
  },
  aadharNumber: {
    type: String
  },
  aadharFront: {
    type: String,
    default: ""
  },
  aadharBack: {
    type: String,
    default: ""
  },
  voterIdNumber: {
    type: String,
    default: ""
  },
  voterIdFront: {
    type: String,
    default: ""
  },
  voterIdBack: {
    type: String,
    default: ""
  },
  passportFront: {
    type: String,
    default: ""
  },
  passportBack: {
    type: String,
    default: ""
  },
  interPassport: {
    type: String,
    default: ""
  },
  photoIdProof: {
    type: String,
    default: ""
  },
  visaCopy: {
    type: String,
    default: ""
  },
  dlFront: {
    type: String,
    default: ""
  },
  dlBack: {
    type: String,
    default: ""
  },
  interDlFront: {
    type: String,
    default: ""
  },
  interDlBack: {
    type: String,
    default: ""
  },
});

module.exports = mongoose.model("documents", document);
