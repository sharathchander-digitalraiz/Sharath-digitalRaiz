const Vehicles_attendance = require("../../../model/vehicles_attandance");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const Useraccess = require("../../../model/useraccess");
const Zones = require("../../../model/zones");
const Circles = require("../../../model/circles");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.transport_vehicles = async (req, res) => {
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
    if (tenent_id == "" || tenent_id == undefined) {
      return res.status(400).send({
        login: true,
        success: false,
        message: "Tenent id is required",
      });
    }

    const zones_details = await Zones.find({ tenent_id: tenent_id }).exec();
    let final_array = [];
    await Promise.all(
      zones_details.map(async (val) => {
        let obj = { zone_name: val.name };
        obj["circle_details"] = [];
        obj["total"] = [];
        const circle_details = await Circles.find({
          zones_id: val._id,
          tenent_id: tenent_id,
        }).exec();
        //console.log(circle_details)
        let count_vehicles = 0;
        let count_vehicles_present = 0;
        let count_vehicles_abscent = 0;
        await Promise.all(
          circle_details.map(async (val) => {
            let cir_obj = { circle_no: val.circle_no, circle_name: val.name };
            const total_vehicles = await Vehicles_attendance.find({
              circles_id: val._id,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              date: formatted_date,
            }).countDocuments();
            const total_vehicles_present = await Vehicles_attendance.find({
              circles_id: val._id,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              date: formatted_date,
              attandance: 1,
            }).countDocuments();
            cir_obj["total_vehicles"] = total_vehicles;
            count_vehicles = count_vehicles + total_vehicles;
            cir_obj["total_vehicles_present"] = total_vehicles_present;
            count_vehicles_present =
              count_vehicles_present + total_vehicles_present;
            cir_obj["total_vehicles_abscent"] =
              total_vehicles - total_vehicles_present;
            count_vehicles_abscent =
              count_vehicles_abscent +
              (total_vehicles - total_vehicles_present);
            obj["circle_details"].push(cir_obj);
            //console.log(total_vehicles);
          })
        );
        obj["total"].push({
          count_vehicles: count_vehicles,
          count_vehicles_present: count_vehicles_present,
          count_vehicles_abscent: count_vehicles_abscent,
        });
        final_array.push(obj);
      })
    );
    return res
      .status(200)
      .send({ login: true, status: true, data: final_array });
  } else {
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id,
    }).exec();
    let acc_zones = [];
    let acc_circles = [];

    acc_zones = access_data["zones"].map((val) => {
      return ObjectId(val);
    });

    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });

    const zones_details = await Zones.find({ _id: { $in: acc_zones } }).exec();
    let final_array = [];
    await Promise.all(
      zones_details.map(async (val) => {
        let obj = { zone_name: val.name };
        obj["circle_details"] = [];
        obj["total"] = [];
        const circle_details = await Circles.find({
          zones_id: val._id,
          _id: { $in: acc_circles },
        }).exec();

        let count_vehicles = 0;
        let count_vehicles_present = 0;
        let count_vehicles_abscent = 0;
        await Promise.all(
          circle_details.map(async (val) => {
            let cir_obj = { circle_no: val.circle_no, circle_name: val.name };
            const total_vehicles = await Vehicles_attendance.find({
              circles_id: val._id,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              date: formatted_date,
            }).countDocuments();
            const total_vehicles_present = await Vehicles_attendance.find({
              circles_id: val._id,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              date: formatted_date,
              attandance: 1,
            }).countDocuments();
            cir_obj["total_vehicles"] = total_vehicles;
            count_vehicles = count_vehicles + total_vehicles;
            cir_obj["total_vehicles_present"] = total_vehicles_present;
            count_vehicles_present =
              count_vehicles_present + total_vehicles_present;
            cir_obj["total_vehicles_abscent"] =
              total_vehicles - total_vehicles_present;
            count_vehicles_abscent =
              count_vehicles_abscent +
              (total_vehicles - total_vehicles_present);
            obj["circle_details"].push(cir_obj);
            //console.log(total_vehicles);
          })
        );
        obj["total"].push({
          count_vehicles: count_vehicles,
          count_vehicles_present: count_vehicles_present,
          count_vehicles_abscent: count_vehicles_abscent,
        });
        final_array.push(obj);
      })
    );
    return res
      .status(200)
      .send({ login: true, status: true, data: final_array });
  }
};
