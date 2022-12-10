const mongoose = require("mongoose");

const subcategory = mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    category_name: String,
    subcategory_name: {
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

module.exports = mongoose.model("Subcategory", subcategory);
