// importing the models
const notificationModel = require("../../model/notification");
const customerModel = require("../../model/customer");
const mongoose = require("mongoose");

// create new notification
exports.createNotification = async function (req, res) {
  try {
    let allUsers = [];
    const notifyUserId = await customerModel.find();

    if (req.body.userList == []) {
      notifyUserId.map((item) => {
        allUsers.push(item._id.toString());
      });
    } else {
      allUsers = req.body.userList;
    }

    console.log(allUsers);

    const notifyObj = new notificationModel({
      title: req.body.title,
      description: req.body.description,
      // image: req.file.path,
      createdBy: req.userId,
      user_id: allUsers
    });

    notifyObj.save(function (err, result) {
      if (err) {
        res.status(400).json({ message: "Something went wrong..!" });
      }
      if (result) {
        res.status(200).json({ message: "Notification created successfully" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get all notifications
exports.showAllNotification = async function (req, res) {
  try {
    const notifyResult = await notificationModel
      .find({})
      .sort({ createdAt: -1 });
    if (notifyResult) {
      res.status(200).json({ message: "Success", notifyResult });
    }
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all notifications based on user id in the notification collection
exports.getAllNotificationbyUserId = async function (req, res) {
  // try {

  console.log(req.userId);

  const notifResult = await notificationModel
    .find({
      user_id: { $in: [req.userId] }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ message: "Successs", notifResult });
  // } catch (err) {
  //   res.status(400).json({ message: "Bad request" });
  // }
};

// update notification
exports.editNotification = async function (req, res) {
  try {
    const changeNotif = await notificationModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          image: req.file ? req.file.path : console.log("No img"),
          description: req.body.description,
          Status: req.body.Status
        }
      },
      { new: true }
    );

    if (changeNotif) {
      res.status(200).json({ message: "Notification updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// remove objectId of the perticular user from the notification collection
exports.deleteNotification = async function (req, res) {
  try {
    let userid = req.userId;
    const notifyResult = await notificationModel.findOne({
      _id: req.params.id
    });
    let array = notifyResult.user_id;

    console.log(array);

    const index = array.indexOf(userid);
    let newArr;
    if (index > -1) {
      // only splice array when item is found
      newArr = array.splice(index, 1); // 2nd parameter means remove one item only
    }

    console.log(newArr);

    const notificationResult = await notificationModel.findOneAndUpdate(
      { _id: req.params.id },
      { user_id: array }
    );

    if (notificationResult) {
      res.status(200).json({ message: "Notifications removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// permanently remove a perticular notification for all users
exports.removeNotification = async function (req, res) {
  try {
    const removeResult = await notificationModel.findByIdAndDelete({
      _id: req.params.id
    });

    if (removeResult) {
      res.status(200).json({ message: "Notification removed successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
