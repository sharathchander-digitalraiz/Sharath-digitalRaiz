const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicles = require("../../../model/vehicles");
const Vehicles_attendance = require("../../../model/vehicles_attandance");
const Useraccess = require("../../../model/useraccess");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.sfa_sat_attendance_times = async (req, res) => {
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
  }

  if (role_data.name == "Admin") {
    let timings_details = await Vehicles_attendance.find(
      {
        tenent_id: tenent_id,
        vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        date: formatted_date
      },
      {
        log_date_created: 1,
        zone: 1,
        circle: 1,
        sfa_name: 1,
        vehicle_registration_number: 1
      }
    ).sort({ circle: 1 });

    const vehicle_timings = [];
    let i = 0;
    await Promise.all(
      timings_details.map(async (details, index) => {
        var date = new Date(details.log_date_created);
        var get_hour = date.getHours();

        vehicle_timings[i] = {};
        vehicle_timings[i].zone = details.zone;
        vehicle_timings[i].circle = details.circle;
        vehicle_timings[i].sfa_name = details.sfa_name;
        vehicle_timings[i].vehicle_registration_number =
          details.vehicle_registration_number;
        if (get_hour <= "05") {
          vehicle_timings[i].s5can = 1;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour >= "05" && get_hour <= "06") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 1;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour >= "06" && get_hour <= "07") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 1;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour >= "07" && get_hour <= "08") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 1;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour > "08") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 1;
        } else {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        }
        if (
          vehicle_timings[i].s5can == 0 &&
          vehicle_timings[i].s6can == 0 &&
          vehicle_timings[i].s7can == 0 &&
          vehicle_timings[i].s8can == 0 &&
          vehicle_timings[i].s9can == 0
        ) {
          vehicle_timings[i].abs = 1;
        } else {
          vehicle_timings[i].abs = 0;
        }
        i++;
      })
    );

    return res
      .status(200)
      .send({ login: true, success: true, data: vehicle_timings });
  } else {
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id
    }).exec();
    let acc_circles = [];
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });

    const timings_details = await Vehicles_attendance.find(
      {
        circles_id: { $in: acc_circles },
        vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        date: formatted_date
      },
      {
        log_date_created: 1,
        zone: 1,
        circle: 1,
        sfa_name: 1,
        vehicle_registration_number: 1
      }
    )
      .sort({ circle: 1 })
      .exec();
    const vehicle_timings = [];
    let i = 0;
    await Promise.all(
      timings_details.map(async (details, index) => {
        var date = new Date(details.log_date_created);
        var get_hour = date.getHours();

        vehicle_timings[i] = {};
        vehicle_timings[i].zone = details.zone;
        vehicle_timings[i].circle = details.circle;
        vehicle_timings[i].sfa_name = details.sfa_name;
        vehicle_timings[i].vehicle_registration_number =
          details.vehicle_registration_number;
        if (get_hour <= "05") {
          vehicle_timings[i].s5can = 1;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour >= "05" && get_hour <= "06") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 1;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour >= "06" && get_hour <= "07") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 1;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour >= "07" && get_hour <= "08") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 1;
          vehicle_timings[i].s9can = 0;
        } else if (get_hour > "08") {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 1;
        } else {
          vehicle_timings[i].s5can = 0;
          vehicle_timings[i].s6can = 0;
          vehicle_timings[i].s7can = 0;
          vehicle_timings[i].s8can = 0;
          vehicle_timings[i].s9can = 0;
        }
        if (
          vehicle_timings[i].s5can == 0 &&
          vehicle_timings[i].s6can == 0 &&
          vehicle_timings[i].s7can == 0 &&
          vehicle_timings[i].s8can == 0 &&
          vehicle_timings[i].s9can == 0
        ) {
          vehicle_timings[i].abs = 1;
        } else {
          vehicle_timings[i].abs = 0;
        }
        i++;
      })
    );

    return res
      .status(200)
      .send({ login: true, success: true, data: vehicle_timings });
  }
};
