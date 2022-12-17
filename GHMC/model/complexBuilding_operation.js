const mongoose = require("mongoose");
const parkingOperations_Schema = new mongoose.Schema({
  date: {
    type: String,
    required: false,
    trim: true
  },
  zones_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "zones",
    required: false
  },
  zone: {
    type: String,
    required: false,
    trim: true
  },
  circles_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "circles",
    required: false
  },
  circle: {
    type: String,
    required: false,
    trim: true
  },
  ward_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wards",
    required: false
  },
  ward_name: {
    type: String,
    required: false,
    trim: true
  },
  area_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "area",
    required: false
  },
  area: {
    type: String,
    required: false,
    trim: true
  },
  landmark_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "landamrks",
    required: false
  },
  landmark: {
    type: String,
    required: false,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  basements: {
    type: String,
    required: true,
    trim: true,
  },
  ground_floors: {
    type: String,
    required: true,
    trim: true,
  },
  property_no: {
    type: String,
    required: false,
    trim: true
  },
  floors: {
    type: String,
    required: false,
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false
  },
  collection_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comercial_building",
    required: false
  },
  approx_weight: {
    type: Number,
    required: false,
    trim: true
  },
  picked_denied: {
    type: String,
    required: false,
    trim: true
  },
  wt_type: {
    type: String,
    required: false,
    trim: true
  },
  db_type: {
    type: String
  },
  attend: {
    type: String,
    required: false,
    trim: true
  },
  reason: {
    type: String,
    required: false
  },
  tenent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tenent",
    required: false
  },
  status: {
    type: String,
    default: "Active"
  },
  image: [{ img: { type: String } }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false
  },
  log_date_created: {
    type: Date,
    default: new Date()
  },
  modified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false
  },
  log_date_modified: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("complexbuilding_Operation", parkingOperations_Schema);
