const mongoose = require("mongoose");
const customer = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  alternate_phone: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  profilePic: {
    type: String,
    default: ""
  },
  occupation: {
    type: String,
    enum: ["employee", "business", "student"],
    required: false
  },
  occupationdetails: {
    type: String
  },
  occupationIdCard: {
    type: String,
    default: ""
  },
  address: {
    type: String
  },
  residentStatus: {
    type: String,
    enum: ["resident", "nonResident"]
  },
  dlNumber: {
    type: String
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId
  },
  countryName: {
    type: String
  },
  appFcmToken: {
    type: String,
    default: ""
  },
  appServerKey: {
    type: String,
    default: ""
  },
  wallet: {
    type: String,
    default: "0"
  },
  totalCharges: {
    type: String,
    default: "0"
  },
  reasonOfCharges: {
    type: String,
    default: ""
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
    default: false
  },
  notification_bell:{
    type: Boolean,
    enum:[true, false],
    default:true,  
  },
  isBlocked: {
    type: Boolean,
    enum: [false, true],
    default: false
  }
});

module.exports = mongoose.model("customers", customer);
