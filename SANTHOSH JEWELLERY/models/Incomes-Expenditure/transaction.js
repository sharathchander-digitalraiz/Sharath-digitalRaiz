const mongoose = require("mongoose");

const transaction = mongoose.Schema(
  {
    date: String,
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Types",
    },
    transaction_name: String,
    type: {
      type: String,
      enum: ["Credit", "Debit"],
    },
    remarks: String,
    created_by: String,
    created_log_date: String,
    modified_by: String,
    modified_log_date: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transaction);
