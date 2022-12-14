const mongoose = require("mongoose");
const projectName = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    index: true
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  }
});

module.exports = mongoose.model("projectNames", projectName);
