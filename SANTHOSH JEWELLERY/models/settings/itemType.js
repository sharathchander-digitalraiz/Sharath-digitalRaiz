const mongoose = require("mongoose");

const itemType = mongoose.Schema(
  {
    item_name: String,
    status: {
      type: String,
      enum: ["Active", "In Active"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemType", itemType);
