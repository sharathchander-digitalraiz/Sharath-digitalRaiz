const mongoose = require("mongoose");

const category = mongoose.Schema(
  {
    category_name: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", category);
