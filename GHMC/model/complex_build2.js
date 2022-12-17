const mongoose = require("mongoose");

const complex_building_2_att_Schema = new mongoose.Schema({
  uuid: {
    type: String,
    required: false,
    trim: true,
  },
  complex_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comercial_building",
    required: true,
  },
  floor: {
    type: String,
    required: true,
    trim: true,
  },
  floor_no: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  business_type: {
    type: String,
    required: false,
    trim: true,
  },
  business_name: {
    type: String,
    required: false,
    trim: true,
  },
  shop_address: {
    type: String,
    required: false,
    trim: true,
  },
  owner_name: {
    type: String,
    required: true,
    trim: true,
  },
  owner_mobile: {
    type: String,
    required: true,
    trim: true,
  },
  owner_aadhar: {
    type: String,
    required: false,
    trim: true,
  },
  licence_number: {
    type: String,
    required: false,
    trim: true,
  },
  licence_no: {
    type: String,
    required: false,
    trim: true,
  },
  existing_disposal: {
    type: String,
    required: true,
    trim: true,
  },
  approx_quality_waste: {
    type: String,
    required: true,
    trim: true,
  },
  wastage_quantity: {
    type: Number,
    required: true,
    trim: true,
  },
  resident_type: {
    type: String,
    required: false,
    trim: true,
  },
  eighteenabove: {
    type: Number,
    required: false,
    trim: true,
  },
  eighteenbelow: {
    type: Number,
    required: false,
    trim: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
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
  place: { type: { type: String }, coordinates: [Number] },
  image: [{ img: { type: String } }],
  unique_no: {
    type: String,
    required: false,
    trim: true,
  },
  qr_code_view: {
    type: String,
    required: false,
    trim: true,
  },
  qr_image: {
    type: String,
    required: false,
    trim: true,
  },
  family: [
    {
      name: String,
      age: Number,
      gender: String,
      mobile: Number,
      aadhar: Number,
      eighteen_plus: Number,
      property_no: String,
      vaccine_type: String,
      vaccine_yes_no: String,
      first_dose_yes_no: String,
      first_dost_date: String,
      second_dose_yes_no: String,
      second_dose_date: String,
    },
  ],
});
complex_building_2_att_Schema.index({ place: "2dsphere" });
complex_building_2_att_Schema.index({
  owner_mobile: "text",
  shop_address: "text",
});
module.exports = mongoose.model(
  "comercial_flats",
  complex_building_2_att_Schema
);
