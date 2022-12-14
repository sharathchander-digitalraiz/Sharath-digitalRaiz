const customerModel = require("../../model/customer");
const custWalletModel = require("../../model/custWallet");

// wallet history - for admin
exports.getAllWalletHistory = async function (req, res) {
  try {
    const walletHistResult = await custWalletModel
      .find()
      .sort({ logDateCreated: -1 });

    res.status(200).json({ message: "Success", walletHistResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// wallet history - for user
exports.getCustomerWalletHistory = async function (req, res) {
  try {
    const walletHistResult = await custWalletModel.find({
      customerId: req.userId
    });

    res.status(200).json({ message: "Success", walletHistResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
