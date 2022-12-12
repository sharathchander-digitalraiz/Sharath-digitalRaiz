const mongoose = require("mongoose");
const operation = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins"
    },
    userName: {
      type: String,
      index: true
    },
    email: {
      type: String,
      index: true
    },
    loginTime: {
      type: String
    },
    logoutTime: {
      type: String,
      default: ""
    },
    ipAddress: {
      type: String
    },
    session_id: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("operations", operation);
