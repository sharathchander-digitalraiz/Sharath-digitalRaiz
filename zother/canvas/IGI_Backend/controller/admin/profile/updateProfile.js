// importing the required model
const User = require("../../../model/userAuth");

// update the admin profile
exports.updateProfile = async function (req, res) {
  try {
    let updateResult = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        username: req.body.username,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        status: req.body.status,
      }
    );

    if (updateResult) {
      res.status(200).json({ message: `Admin profile updated successfully!` });
    }
  } catch (err) {
    res.status(400).json({ message: `Something went wrong..!` });
  }
};

// update admin users status
exports.updateAdminUserStatus = async function (req, res) {
  try {
    const changeStatus = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        status: req.body.status,
      }
    );

    if (changeStatus) {
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// delete the admin profile picture
exports.removeProfilePic = async function (req, res) {
  const remPflPic = await User.findByIdAndUpdate(
    { _id: req.body._id },
    { profilePicture: "" }
  );
  if (remPflPic) {
    res
      .status(200)
      .json({ message: "Successfully removed the profile picture" });
  }
};

exports.deleteProfile = async function (req, res) {
  const deletePrfileResult = await User.findByIdAndDelete({
    _id: req.params.id,
  });

  if (deletePrfileResult) {
    res.status(200).json({ message: "Successfully removed the profile" });
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};
