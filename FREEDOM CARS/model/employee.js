const mongoose = require("mongoose");
const employee = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    index: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: Number
  },
  profilePic: {
    type: String,
    default: "uploads/public/userlogo1.png"
  },
  address: {
    type: String
  },
  deptId: {
    type: mongoose.Schema.Types.ObjectId
  },
  deptName: {
    type: String
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId
  },
  role: {
    type: String,
    default: "employee"
  },
  permissions: {
    type: Array
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId
  },
  branchName: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId
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
  joiningDate: {
    type: String,
    default: ""
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  }
});

const employeeAuth = mongoose.model("employees", employee);
module.exports = employeeAuth;
