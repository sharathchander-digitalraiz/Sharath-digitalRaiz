const mongoose = require("mongoose");
const driver = new mongoose.Schema({
  driverName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    index: true
  },
  dlNumber: {
    type: String
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
  phone: {
    type: String,
    required: true,
    unique: true
  },
  profilePic: {
    type: String,
    default: "uploads/public/userlogo1.png"
  },
  dateOfBirth: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  stateName: {
    type: String
  },
  countryName: {
    type: String
  },
  countryCode: {
    type: String
  },
  zipCode: {
    type: String
  },
  membershipType: {
    type: String,
    enum: ["1", "2", "3", "4", "5"]
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId
  },
  adminName: {
    type: String
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId
  },
  branchName: {
    type: String
  },
  emailVerify: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  phoneVerify: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  faceVerify: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
  residentStatus: {
    type: String,
    enum: ["resident", "nonResident"],
    required: true
  },
  occupation: {
    type: String,
    enum: ["employee", "business", "student"],
    required: true
  },
  occupationdetails: {
    type: String
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
  isBlocked: {
    type: Boolean,
    enum: [false, true],
    default: false
  },
});

module.exports = mongoose.model("drivers", driver);
/*
ID NUMBER (8) NOT NULL,
o	DL_NUMBER CHAR (8) NOT NULL,
o	ADMIN_ID VARCHAR (10) NOT NULL,
o	BRANCH_ID VARCHAR (10) NULL,
o	FULLNAME VARCHAR (25) NOT NULL, 
o	USERNAME VARCHAR (25) NOT NULL, // Not used included email instead
o	PHONE_NUMBER NUMBER (10) NOT NULL, EMAIL_ID VARCHAR (30) NOT NULL,
o	PROFILE_PIC VARCHAR (30) NOT NULL,
o	DATE_OF_BIRTH DATE NOT NULL,
o	ADDRESS VARCHAR (30) NOT NULL,
o	CITY VARCHAR (20) NOT NULL,
o	STATE_NAME VARCHAR (20) NOT NULL,
o	COUNTRY_NAME VARCHAR (20) NOT NULL,
o	COUNTRY_ID NUMBER (20) NOT NULL,
o	ZIPCODE NUMBER (5) NOT NULL,
o	MEMBERSHIP_TYPE CHAR (1) DEFAULT 'N' NOT NULL, MEMBERSHIP_ID CHAR (5),
o	STATUS ENUM (ACTIVE, INACTIVE)
o	EMAIL_ID_VERIFICATION  DEFUALT ‘NO’ NOT NULL,
o	PHONE_NUMBER_VERIFICATION DEFAULT ‘NO’NOT NULL,
o	FACE_RECONIGATION VERIFICATION (20) /*
o	RESIDENT_STATUS ENUM (RESIDENT, NON RESIDENT)
o	OCUPATION ENUM (EMPLOYEE, BUSINESS, STUDENT)
o	OCUPATION DETAILS VARCHAR (50) NOT NULL,
o	CONSTRAINT CUSTOMERPK PRIMARY KEY (DL_NUMBER)
*/
