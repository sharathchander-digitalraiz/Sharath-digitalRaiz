const userModel = require("../../../model/userAuth");

// get user profile
exports.getUserProfile = async function (req, res) {
  try {
    const userResult = await userModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", userResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all user profiles
exports.getAllUserProfiles = async function (req, res) {
  try {
    const usersResult = await userModel.find().sort({ createdAt: -1 });

    res.status(200).json({ message: "Success", usersResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update user profile
exports.editUserProfile = async function (req, res) {
  try {
    const changeResult = await userModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        countrtyCode: req.body.countrtyCode,
        contactNumber: req.body.contactNumber
      }
    );

    if (changeResult) {
      res.status(200).json({ message: "User details updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove user by admin only..
exports.remvoveUser = async function (req, res) {
  try {
    const removeResult = await userModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removeResult) {
      res.status(200).json({ message: "User removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
