const express = require("express");
const router = express.Router();

// importing the functions
const { verifyToken } = require("../../commonMiddleWare");
const { createMeeting } = require("../../controller/web/videoroom/videoroom");
const {
  createScheduleMeeting,
  getAllScheduleMeetings,
  removeMeeting
} = require("../../controller/web/scheduleMeeting/scheduleMeeting");

// defining the routes
/********* create a random meeting ********/
router.post("/user/meeting", verifyToken, createMeeting);

/************ Schedule meeting **************/
router.post("/user/schedule-meeting", verifyToken, createScheduleMeeting);

router.post(
  "/user/getallschedule-meeting",
  verifyToken,
  getAllScheduleMeetings
);

/************** remove scheduled video calls **************/
router.delete(
  "/admin/shedulemeeting/removemeeting/:id",
  verifyToken,
  removeMeeting
);

module.exports = router;
