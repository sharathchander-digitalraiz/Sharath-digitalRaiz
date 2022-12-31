var request = require("request");
const userAuth = require("../../../model/userAuth");
const { v4: uuidv4 } = require("uuid");
const meetingRoomModel = require("../../../model/meetingRoom");

exports.createMeeting = async function (req, res) {
  try {
    const userData = await userAuth.findById({ _id: req.userId });
    var projectId = "632063031b548a17e3993d48";
    var appkey = "9rjTx0UN1Z09wvf";

    var response = {
      data: {
        token: ""
      }
    };
    var options = {
      method: "GET",
      url:
        "https://api.inapi.vc/publicuser/getTokenbyId?projectId=" + projectId,
      headers: { Authorization: `Bearer ${appkey}` }
    };
    request(options, function (error, response) {
      if (error) {
        res.status(400).json({ message: error.error });
      } else {
        var body = JSON.parse(response.body);
        if (body.status == true) {
          // console.log(body);
          var token = body.data.token;
          var uuid = `${uuidv4()}`;
          // console.log(token);
          var options = {
            method: "POST",
            url: "https://api.inapi.vc/publicuser/createSession",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              projectId: projectId,
              token: token,
              meetingDetails: {
                meetingName: req.body.meetingName,
                meetingId: uuid,
                hostUid: userData._id
              },
              entryTime: Date.now(),
              sessionName: userData.firstName + uuid
            })
          };

          request(options, function (error, response) {
            if (error) {
              res.status(400).json({ message: error.error });
            } else {
              var result = JSON.parse(response.body);
              var url =
                "https://qvc.invc.vc/" +
                result.data.sessionId +
                "?token=" +
                token +
                "&projectId=" +
                projectId +
                "&uid=" +
                Buffer.from(userData._id).toString("base64");
            }

            const roomObj = new meetingRoomModel({
              projectId: projectId,
              token: token,
              meetingName: req.body.meetingName,
              meetingId: uuid,
              hostUid: userData._id,
              entryTime: Date.now(),
              sessionName: userData._id + uuid
            });

            roomObj.save();
            res.status(200).json({ message: "Success", url: url });
          });
        } else {
          res.status(400).json({ message: body.error });
        }
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
