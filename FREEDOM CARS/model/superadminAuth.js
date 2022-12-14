const { Schema, model, SchemaType } = require("mongoose");
const bcrypt = require("bcrypt");

const superadminSchema = new Schema({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 500,
    trim: true,
    index: true,
    required: true
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 500,
    trim: true,
    index: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    default: "superadmin"
  },
  profileImage: {
    type: String,
    default: "uploads/public/userlogo1.png"
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  postalCode: {
    type: String,
    required: true
  },
  logDateCreated: {
    type: String,
    default: new Date().toISOString()
  },
  logDateModified: {
    type: String,
    default: new Date().toISOString()
  },
  status: {
    type: Boolean,
    enum: [false, true],
    default: true
  },
  isDelete: {
    type: Boolean,
    enum: [false, true],
    default: false
  }
});

const superadmin = model("superadmins", superadminSchema);

module.exports = superadmin;
