const mongoose = require("mongoose");

const drawing_recieved_from = mongoose.Schema(
  {
    name: String,
    status: {
      type: String,
      enum: ["Started", "Completed"],
      default: "Started",
    },
    image: String,
  },
  { timestamps: true });

module.exports = mongoose.model("Drawing_recieved_from", drawing_recieved_from );
