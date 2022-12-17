const department = require("../model/department");

const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: false,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  add_type: {
    type: String,
    required: false,
    trim: true,
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  tenent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tenent",
    required: true,
  },
  department_name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  mobile_number: {
    type: String,
    required: false,
    trim: true,
  },
  status: {
    type: String,
    default: "Active",
  },
  log_date_created: {
    type: Date,
    default: new Date(),
  },
  log_date_modified: {
    type: Date,
    default: new Date(),
  },
  fcm_token: {
    type: String,
    default: new Date(),
  },
  user_access_name: {
    type: String,
  },
  profile: {
    type: String,
  },
  user_access_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "useraccess",
    required: false,
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  modified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  user_geoaccess_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tenent_geo_tagging_access",
    required: false,
  },
  emailOtp: {
    type: String,
  },
});
module.exports = mongoose.model("users", usersSchema);
