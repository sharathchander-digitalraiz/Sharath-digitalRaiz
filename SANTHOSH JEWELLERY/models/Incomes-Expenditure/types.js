const mongoose = require("mongoose");

const types = mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    category_name: String,
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    subcategory_name: String,
    amount: Number,
    description: String,
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Types", types);
