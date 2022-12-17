const Vehicles_attendance = require("../../../model/vehicles_attandance");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicles = require("../../../model/vehicles");
const Useraccess = require("../../../model/useraccess");
const Zones = require("../../../model/zones");
const Circles = require("../../../model/circles");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var TransferStation = require("../../../model/transferstation");

exports.transferStationWiseTransportAttendanceBasedOnTrips = async (
  req,
  res
) => {
  let documents = [];
  let i = 0;

  const { user_id, tenent_id, date_search } = req.body;
  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { department_id: 1, user_access_id: 1 }
  ).exec();

  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  var d = new Date();
  var n = d.getHours();
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let cd;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  // console.log(cd)
  let formatted_date;
  if (date_search == "") {
    formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      cd;
  } else {
    formatted_date = date_search;
  } //

  if (role_data.name == "Admin") {
    if (tenent_id == "" || tenent_id == undefined) {
      return res.status(400).send({
        login: true,
        success: false,
        message: "Tenent id is required",
      });
    }

    let vehicles = await Vehicles.find({ tenent_id: tenent_id });

    await Promise.all(
      vehicles.map(async (item) => {
        console.log(item.zone);

        let tdata = await TransferStation.find({
          import_data_unique_no: item.unique_no,
          data: formatted_date,
        });

        documents[i] = {};
        documents[i].zone_name = item.zone;
        documents[i].circleName = item.circle;
        documents[i].ward_name = item.wards_no + "-" + item.ward_name;
        documents[i].sfaName = item.incharge;
        documents[i].vehicle_registration_number =
          item.vehicle_registration_number;
        documents[i].owner_type = item.owner_type;
        documents[i].vehicle_type = item.vehicle_type;

        if (tdata.length > 0) {
          let userdata = await User.findOne({ _id: tdata.user_id });
          documents[i].transferStation1 =
            userdata.firstname + "-" + userdata.lastname;
          documents[i].dateTime1 = tdata.log_date_created;
          documents[i].TripsCount1 = 1;
        } else {
          documents[i].transferStation1 = "-";
          documents[i].dateTime1 = "-";
          documents[i].TripsCount1 = "-";
        }
        if (tdata.length > 1) {
          let userdata = await User.findOne({ _id: tdata.user_id });
          documents[i].transferStation2 =
            userdata.firstname + "-" + userdata.lastname;
          documents[i].dateTime2 = tdata.log_date_created;
          documents[i].TripsCount2 = 1;
        } else {
          documents[i].transferStation2 = "-";
          documents[i].dateTime2 = "-";
          documents[i].TripsCount2 = "-";
        }
        if (tdata.length > 2) {
          let userdata = await User.findOne({ _id: tdata.user_id });
          documents[i].transferStation3 =
            userdata.firstname + "-" + userdata.lastname;
          documents[i].dateTime3 = tdata.log_date_created;
          documents[i].TripsCount3 = 1;
        } else {
          documents[i].transferStation3 = "-";
          documents[i].dateTime3 = "-";
          documents[i].TripsCount3 = "-";
        }
        if (tdata.length > 3) {
          let userdata = await User.findOne({ _id: tdata.user_id });
          documents[i].transferStation4 =
            userdata.firstname + "-" + userdata.lastname;
          documents[i].dateTime4 = tdata.log_date_created;
          documents[i].TripsCount4 = 1;
        } else {
          documents[i].transferStation4 = "-";
          documents[i].dateTime4 = "-";
          documents[i].TripsCount4 = "-";
        }
        if (tdata.length > 4) {
          let userdata = await User.findOne({ _id: tdata.user_id });
          documents[i].transferStation5 =
            userdata.firstname + "-" + userdata.lastname;
          documents[i].dateTime5 = tdata.log_date_created;
          documents[i].TripsCount5 = 1;
        } else {
          documents[i].transferStation5 = "-";
          documents[i].dateTime5 = "-";
          documents[i].TripsCount5 = "-";
        }
        if (tdata.length > 5) {
          let userdata = await User.findOne({ _id: tdata.user_id });
          documents[i].transferStation6 =
            userdata.firstname + "-" + userdata.lastname;
          documents[i].dateTime6 = tdata.log_date_created;
          documents[i].TripsCount6 = 1;
        } else {
          documents[i].transferStation6 = "-";
          documents[i].dateTime6 = "-";
          documents[i].TripsCount6 = "-";
        }

        i++;
      })
    );
  }
  res.status(200).json({ message: "Success", data: documents });
};
