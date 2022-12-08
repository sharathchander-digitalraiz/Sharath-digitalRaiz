const qrcode = require("qrcode");
const customerSchema = require("../../models/customers/customerSchema");

exports.customerQrCode = async function (req, res) {
  try {
    const customerData = await customerSchema.findById({ _id: req.params.id });
    if (customerData) {
      let stJson = JSON.stringify(customerData);
      // qrcode.toString(stJson, { type: "utf8" },
      qrcode.toDataURL(stJson, function (err, code) {
        if (err) res.status(400).json({ success: false, message: err });
        else
          res.status(200).json({ success: true, message: "successfull", code });
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "customer data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
