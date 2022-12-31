const mongoose = require("mongoose");
const schedulemeeting = new mongoose.Schema(
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
    meetingDate: {
      type: String
    },
    meetingTime: {
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
    },
    url: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("schedulemeetings", schedulemeeting);
