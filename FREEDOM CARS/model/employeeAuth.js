const { Schema, model, SchemaType, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 500,
    trim: true,
    index: true,
    required: true
  },
  lastName: {
    type: String,
    minlength: 3,
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
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "departments",
  },
  departmentName: {
    type: String
  },
  role: {
    type: String,
    enum: [
      "superadmin",
      "admin",
      "supportadmin",
      "salesadmin",
      "salesuser",
      "marketingadmin",
      "marketinguser",
      "accountsadmin",
      "accountsuser"
    ]
  },
  profileImage: {
    type: String,
    default: "uploads/public/userlogo1.png"
  },
  address: {
    type: String,
    required: true,
    minlength: [5, "address can not be less than 5 characters"]
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

const employeeModel = model("employees", employeeSchema);

module.exports = employeeModel;
