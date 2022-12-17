const users = require("../model/users");
const tenent = require("../model/tenent");
const zones = require("../model/zones");
const circles = require("../model/circles");
const wards = require("../model/wards");
const landamrks = require("../model/landmarks");
const mongoose = require("mongoose");
const vehicles_att_Schema = new mongoose.Schema({
  date: {
    type: String,
    trim: true,
  },
  time: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  zone: {
    type: String,
    required: true,
    trim: true,
  },
  circle_no: {
    type: String,
    required: false,
    trim: true,
  },
  circle: {
    type: String,
    required: true,
    trim: true,
  },
  wards_no: {
    type: String,
    required: true,
    trim: true,
  },
  ward_name: {
    type: String,
    required: true,
    trim: true,
  },
  vehicle_registration_number: {
    type: String,
    required: true,
    trim: true,
  },
  owner_type: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  vehicle_unique_no: {
    type: String,
    required: true,
    trim: true,
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicles",
    required: true,
  },
  tenent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tenent",
    required: true,
  },
  zones_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "zones",
    required: true,
  },
  circles_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "circles",
    required: false,
  },
  ward_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wards",
    required: false,
  },
  landmark_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "landamrks",
    required: false,
  },
  location: { type: String, required: true, trim: true },
  vehicle_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle_type",
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
    default: null,
  },
  sfa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  vehicle_type: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "Active",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  log_date_created: {
    type: Date,
    default: new Date(),
  },
  log_date_modified: {
    type: Date,
    default: new Date(),
  },
  modified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  owner_type: {
    type: String,
    required: true,
    trim: true,
  },
  attandance: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  comment_update: {
    type: String,
    required: true,
    trim: true,
    default: "no",
  },
  scanned_address: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  latitude: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  longitude: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  scan_image: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  sfa_name: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  incharge_mobile_number: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
});
module.exports = mongoose.model("vehicles_attandance", vehicles_att_Schema);
