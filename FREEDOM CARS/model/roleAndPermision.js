const mongoose = require("mongoose");
const roleAndPermit = new mongoose.Schema({
  roleName: {
    type: String
  },
  rolePermission: {
    type: Array
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId
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
    default: true
  }
});

module.exports = mongoose.model("roleAndPermits", roleAndPermit);
