const User = require("../../model/users");
const Useraccess = require("../../model/useraccess");
const Department = require("../../model/department");
const Zones = require("../../model/zones");
const Circles = require("../../model/circles");
const Vehicles = require("../../model/vehicles");
const Vehicle_attendance = require("../../model/vehicles_attandance");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.transport_vehicle_attendance_timings = async (req, res) => {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  // current hours
  let hours = date_ob.getHours();
  // current minutes
  let minutes = date_ob.getMinutes();
  // current seconds
  let seconds = date_ob.getSeconds();
  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  //console.log(new Date(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds) < new Date(year + "-" + month + "-" + date + " " + hours + ":" + 40 + ":" + seconds));
  const before_5am_great = new Date(
    year + "-" + month + "-" + date + " " + 1 + ":" + 1 + ":" + "00"
  );
  // console.log(before_5am_great);

  const before_5am_less = new Date(
    year + "-" + month + "-" + date + " " + 4 + ":" + 59 + ":" + 59
  );
  //  console.log(before_5am_less);

  const before_6am = new Date(
    year + "-" + month + "-" + date + " " + 5 + ":" + 59 + ":" + 59
  );

  const { user_id } = req.body;

  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { department_id: 1, user_access_id: 1 }
  ).exec();
  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let cd;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    cd;
  //   let formatted_date =   '2021-12-05';

  if (role_data.name == "Admin") {
    let newobject = {};
    if (req.body.tenent_id != "" && req.body.tenent_id != undefined) {
      newobject["tenent_id"] = req.body.tenent_id;
    }

    const zones_details = await Zones.find(newobject, { name: 1 })
      .sort({ name: 1 })
      .exec();
    //console.log(zones_details);

    async function transport_vehicle_timings(data) {
      let final_array = [];
      await Promise.all(
        zones_details.map(async (val) => {
          let obj = {};
          obj["zone_details"] = val.name;
          const circles_details = await Circles.find(
            { zones_id: val._id },
            { _id: 1, name: 1, circle_no: 1 }
          )
            .sort({ circle_no: 1 })
            .exec();
          // console.log(circles_details)
          obj["circle_details"] = [];
          await Promise.all(
            circles_details.map(async (cir_val) => {
              let cir_obj = {
                circle_name: cir_val.name,
                circle_no: cir_val.circle_no,
              };
              let sum_arr = [];
              const vehicle_count = await Vehicles.find({
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["vehicle_count"] = vehicle_count;

              const before_5 = await Vehicle_attendance.find({
                time: { $gte: before_5am_great, $lt: before_5am_less },
                circles_id: cir_val._id,
                date: formatted_date,
              }).countDocuments();
              cir_obj["before_5am"] = before_5;
              sum_arr.push(before_5);
              const before_6 = await Vehicle_attendance.find({
                time: { $gte: before_5am_less, $lt: before_6am },
                circles_id: cir_val._id,
                date: formatted_date,
              }).countDocuments();
              cir_obj["before_6am"] = before_6;
              sum_arr.push(before_6);
              const after_6 = await Vehicle_attendance.find({
                time: { $gt: before_5am_less },
                circles_id: cir_val._id,
                date: formatted_date,
              }).countDocuments();
              cir_obj["after_6am"] = after_6;
              sum_arr.push(after_6);
              const sum = sum_arr.reduce((a, b) => a + b, 0);
              cir_obj["total"] = sum;
              obj["circle_details"].push(cir_obj);
            })
          );
          final_array.push(obj);
        })
      );
      return final_array;
    }

    let transportResult = transport_vehicle_timings(1);
    transportResult.then(function (result) {
      res.status(200).send({ login: true, success: true, data: result });
    });
  } else {
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id,
    }).exec();
    // console.log('not')
    let acc_zones = [];
    let acc_circles = [];
    acc_zones = access_data["zones"].map((val) => {
      return ObjectId(val);
    });
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });

    let newobject = {};
    newobject._id = { $in: acc_zones };
    const zones_details = await Zones.find(newobject, { name: 1 })
      .sort({ name: 1 })
      .exec();
    // console.log(zones_details);
    async function transport_vehicle_timing(data) {
      let final_array = [];
      await Promise.all(
        zones_details.map(async (val) => {
          let obj = {};
          obj["zone_details"] = val.name;
          const circles_details = await Circles.find(
            { zones_id: val._id, _id: { $in: acc_circles } },
            { _id: 1, name: 1, circle_no: 1 }
          )
            .sort({ circle_no: 1 })
            .exec();
          // console.log(circles_details);
          obj["circle_details"] = [];
          await Promise.all(
            circles_details.map(async (cir_val) => {
              let cir_obj = {
                circle_name: cir_val.name,
                circle_no: cir_val.circle_no,
              };
              let sum_arr = [];
              const vehicle_count = await Vehicles.find({
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["vehicle_count"] = vehicle_count;

              const before_5 = await Vehicle_attendance.find({
                time: { $gte: before_5am_great, $lt: before_5am_less },
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["before_5am"] = before_5;
              sum_arr.push(before_5);
              const before_6 = await Vehicle_attendance.find({
                time: { $gte: before_5am_less, $lt: before_6am },
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["before_6am"] = before_6;
              sum_arr.push(before_6);
              const after_6 = await Vehicle_attendance.find({
                time: { $gt: before_5am_less },
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["after_6am"] = after_6;
              sum_arr.push(after_6);
              const sum = sum_arr.reduce((a, b) => a + b, 0);
              cir_obj["total"] = sum;
              obj["circle_details"].push(cir_obj);
            })
          );
          final_array.push(obj);
        })
      );
      return final_array;
    }

    let transportResult = transport_vehicle_timing(1);
    transportResult.then(function (result) {
      res.status(200).send({ login: true, success: true, data: result });
    });
  }
};

exports.searchtransport_vehicle_attendance_timings = async (req, res) => {
  let date_ob = new Date();
  // current date

  const { user_id, date_search } = req.body;

  if (date_search == "" || date_search == undefined) {
    return res
      .status(400)
      .send({ login: true, status: false, message: "Please select date" });
  }
  //console.log(new Date(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds) < new Date(year + "-" + month + "-" + date + " " + hours + ":" + 40 + ":" + seconds));
  const before_5am_great = new Date(
    date_search + " " + 1 + ":" + 1 + ":" + "00"
  );
  // console.log(before_5am_great);

  const before_5am_less = new Date(date_search + " " + 4 + ":" + 59 + ":" + 59);
  //  console.log(before_5am_less);

  const before_6am = new Date(date_search + " " + 5 + ":" + 59 + ":" + 59);

  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { department_id: 1, user_access_id: 1 }
  ).exec();
  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let cd;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  let formatted_date = date_search;
  //   let formatted_date =   '2021-12-05';

  if (role_data.name == "Admin") {
    let newobject = {};
    if (req.body.tenent_id != "" && req.body.tenent_id != undefined) {
      newobject["tenent_id"] = req.body.tenent_id;
    }

    const zones_details = await Zones.find(newobject, { name: 1 })
      .sort({ name: 1 })
      .exec();
    //console.log(zones_details);

    async function transport_vehicle_timings(data) {
      let final_array = [];
      await Promise.all(
        zones_details.map(async (val) => {
          let obj = {};
          obj["zone_details"] = val.name;
          const circles_details = await Circles.find(
            { zones_id: val._id },
            { _id: 1, name: 1, circle_no: 1 }
          )
            .sort({ circle_no: 1 })
            .exec();
          // console.log(circles_details)
          obj["circle_details"] = [];
          await Promise.all(
            circles_details.map(async (cir_val) => {
              let cir_obj = {
                circle_name: cir_val.name,
                circle_no: cir_val.circle_no,
              };
              let sum_arr = [];
              const vehicle_count = await Vehicles.find({
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["vehicle_count"] = vehicle_count;

              const before_5 = await Vehicle_attendance.find({
                time: { $gte: before_5am_great, $lt: before_5am_less },
                circles_id: cir_val._id,
                date: formatted_date,
              }).countDocuments();
              cir_obj["before_5am"] = before_5;
              sum_arr.push(before_5);
              const before_6 = await Vehicle_attendance.find({
                time: { $gte: before_5am_less, $lt: before_6am },
                circles_id: cir_val._id,
                date: formatted_date,
              }).countDocuments();
              cir_obj["before_6am"] = before_6;
              sum_arr.push(before_6);
              const after_6 = await Vehicle_attendance.find({
                time: { $gt: before_5am_less },
                circles_id: cir_val._id,
                date: formatted_date,
              }).countDocuments();
              cir_obj["after_6am"] = after_6;
              sum_arr.push(after_6);
              const sum = sum_arr.reduce((a, b) => a + b, 0);
              cir_obj["total"] = sum;
              obj["circle_details"].push(cir_obj);
            })
          );
          final_array.push(obj);
        })
      );
      return final_array;
    }

    let transportResult = transport_vehicle_timings(1);
    transportResult.then(function (result) {
      res.status(200).send({ login: true, success: false, data: result });
    });
  } else {
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id,
    }).exec();
    // console.log('not')
    let acc_zones = [];
    let acc_circles = [];
    acc_zones = access_data["zones"].map((val) => {
      return ObjectId(val);
    });
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });

    let newobject = {};
    newobject._id = { $in: acc_zones };
    const zones_details = await Zones.find(newobject, { name: 1 })
      .sort({ name: 1 })
      .exec();
    // console.log(zones_details);
    async function transport_vehicle_timing(data) {
      let final_array = [];
      await Promise.all(
        zones_details.map(async (val) => {
          let obj = {};
          obj["zone_details"] = val.name;
          const circles_details = await Circles.find(
            { zones_id: val._id, _id: { $in: acc_circles } },
            { _id: 1, name: 1, circle_no: 1 }
          )
            .sort({ circle_no: 1 })
            .exec();
          // console.log(circles_details);
          obj["circle_details"] = [];
          await Promise.all(
            circles_details.map(async (cir_val) => {
              let cir_obj = {
                circle_name: cir_val.name,
                circle_no: cir_val.circle_no,
              };
              let sum_arr = [];
              const vehicle_count = await Vehicles.find({
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["vehicle_count"] = vehicle_count;

              const before_5 = await Vehicle_attendance.find({
                time: { $gte: before_5am_great, $lt: before_5am_less },
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["before_5am"] = before_5;
              sum_arr.push(before_5);
              const before_6 = await Vehicle_attendance.find({
                time: { $gte: before_5am_less, $lt: before_6am },
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["before_6am"] = before_6;
              sum_arr.push(before_6);
              const after_6 = await Vehicle_attendance.find({
                time: { $gt: before_5am_less },
                circles_id: cir_val._id,
              }).countDocuments();
              cir_obj["after_6am"] = after_6;
              sum_arr.push(after_6);

              const sum = sum_arr.reduce((a, b) => a + b, 0);

              cir_obj["total"] = sum;
              obj["circle_details"].push(cir_obj);
            })
          );
          final_array.push(obj);
        })
      );
      return final_array;
    }

    let transportResult = transport_vehicle_timing(1);
    transportResult.then(function (result) {
      return res
        .status(200)
        .send({ login: true, success: false, data: result });
    });
  }
};
