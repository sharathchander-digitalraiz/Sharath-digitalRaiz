const terms = require("../../model/terms");

//post all the terms
exports.postAllTerms = async (req, res) => {
  try {
    const addTerms = new terms({
      customerId: req.body.customerId,
      terms_conditions: req.body.terms_conditions,
      privacy_policy: req.body.privacy_policy,
      refund_policy: req.body.refund_policy,
      help_faq: req.body.help_faq,
      logDateCreated: new Date().toISOString(),
    }).save((err, data) => {
      if (err) {
        return res.status(400).json({ message: "Bad request", Error: err });
      } else {
        res.status(200).json({ message: "added successfully" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get terms_conditions
exports.getTermsConditions = async function (req, res) {
  try {
    const terms_conditions = await terms.findOne({ customerId: req.userId },{terms_conditions:1});
    console.log(terms_conditions)
    if (terms_conditions) {
      res.status(200).json({ message: "Success", terms_conditions });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong" });
  }
};

// get privacy_policy
exports.getPrivacypolicy = async function (req, res) {
  try {
    const Privacypolicy = await terms.findOne({ customerId: req.userId },{privacy_policy:1});
    if (Privacypolicy) {
      res.status(200).json({ message: "Success", Privacypolicy });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong" });
  }
};

// get refund_policy
exports.getRefundPolicy = async function (req, res) {
  try {
    const RefundPolicy = await terms.findOne({ customerId: req.userId },{refund_policy:1});
    if (RefundPolicy) {
      res.status(200).json({ message: "Success", RefundPolicy });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong" });
  }
};

// get help_faq
exports.getHelpFaq = async function (req, res) {
  try {
    const HelpFaq = await terms.findOne({ customerId: req.userId },{help_faq:1});
    if (HelpFaq) {
      res.status(200).json({ message: "Success", HelpFaq });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong" });
  }
};

