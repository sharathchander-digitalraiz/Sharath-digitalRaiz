const summaryDetailModel = require("../../../model/summaryDetail");
const userModel = require("../../../model/adminUsers");

// get dashboard elements
exports.getDashBoardElements = async function (req, res) {
  try {
    const summaryDetailCount = await summaryDetailModel.find().countDocuments();

    const userCount = await userModel.find().countDocuments();

    res.status(200).json({ message: "Success", summaryDetailCount, userCount });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
