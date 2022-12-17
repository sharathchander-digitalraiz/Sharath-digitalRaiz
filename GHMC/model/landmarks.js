const mongoose = require("mongoose");
const landmarksSchema = new mongoose.Schema({
  landmark_no: {
    type: String,
    required: false,
    trim: true,
  },
  landmark_from: {
    type: String,
    required: false,
  },
  landmark_to: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "Active",
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
    required: true,
  },
  wards_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wards",
    required: true,
  },
  areas_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "areas",
    required: true,
  },
  area_id: { type: mongoose.Schema.Types.ObjectId, ref: "areas" },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
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
    default: null,
  },
});
module.exports = mongoose.model("landmarks", landmarksSchema);
