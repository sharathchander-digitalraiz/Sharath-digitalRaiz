const mongoose = require("mongoose");

const department = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },                                                  
    adminName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    logCreatedDate: {
      type: String,
    },
    logModifiedDate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Departments", department);
