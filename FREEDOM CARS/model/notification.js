// defining the mongoose schema
const mongoose = require("mongoose");
const notification = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: "uploads/public/userlogo1.png"
    },
    Status: {
      type: Boolean,
      enum: [false, true],
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    user_id: {
      type: Array
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("notifications", notification);
