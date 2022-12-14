const mongoose = require("mongoose");
const myDocument = new mongoose.Schema({
  collectionName: {
    type: String
  },
  collectDocumentId: {
    type: mongoose.Schema.Types.ObjectId
  },
  dlNumber: {
    type: String
  },
  occupationIdCard: {
    type: String
  },
  passportFront: {
    type: String
  },
  passportBack: {
    type: String
  },
  passportVisa: {
    type: String
  },
  aadharCardFront: {
    type: String
  },
  aadharCardBack: {
    type: String
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
  isApproved: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  isDeleted: {
    type: Boolean,
    enum: [false, true],
    default: false
  }
});

module.exports = mongoose.model("myDocuments", myDocument);
