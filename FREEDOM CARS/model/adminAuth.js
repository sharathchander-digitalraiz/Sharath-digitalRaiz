const mongoose = require("mongoose");
const admin = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    minLength: 1,
    maxLength: 500,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true
  },
  superAdminName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin"
  },
  address: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: "uploads/public/userlogo1.png"
  },
  profilePic: {
    type: String,
    default: "uploads/public/userlogo1.png"
  },
  carsCount: {
    type: Number,
    default: 0
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  expiryDate: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  },
  planType: {
    type: String
  }
});

const adminAuth = mongoose.model("admins", admin);

module.exports = adminAuth;
