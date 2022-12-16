const mongoose = require("mongoose");
const otp = new mongoose.Schema(
  {
    emailOtp: {
      type: String,
    },
    emailId: {
      type: String,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: {
        expireAfterSeconds: 600,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("otp", otp);
