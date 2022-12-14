const mongoose = require("mongoose");
const termsAndConditions = new mongoose.Schema({
  license: {
    type: String,
    required: true,
  },
  terms_conditions: {
    type: String,
    required: true,
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
