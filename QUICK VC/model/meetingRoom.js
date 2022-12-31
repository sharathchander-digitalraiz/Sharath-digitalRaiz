const mongoose = require("mongoose");
const meetingRoom = new mongoose.Schema(
  {
    projectId: {
      type: String
    },
    token: {
      type: String
    },
    meetingName: {
      type: String
    },
    meetingId: {
      type: String
    },
    hostUid: {
      type: mongoose.Schema.Types.ObjectId
    },
    entryTime: {
      type: String
    },
    sessionName: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("meetingRooms", meetingRoom);
