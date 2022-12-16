const mongoose = require("mongoose");
const termsAndConditions = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  license: {
    type: String,
  },
  terms_conditions: {
    type: String,
  },
  privacy_policy: {
    type: String
  },
  refund_policy: {
    type: String
  },
  help_faq: {
    type: String
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
});

module.exports = mongoose.model("TermsAndConditions", termsAndConditions);
