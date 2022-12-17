const Circles = require("../../../model/circles");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicle_attendance = require("../../../model/vehicles_attandance");
const Useraccess = require("../../../model/useraccess");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.circle_sat_attendance = async (req, res) => { 
  const { user_id, tenent_id } = req.body;

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

  if (role_data.name == "Admin") {
    if (tenent_id == "" || tenent_id == undefined) {
      return res
        .status(400)
        .send({ login: true, status: false, message: "Tenent id is required" });
    }
    const circle_details = await Circles.aggregate([
      {
        $lookup: {
          from: "zones", // other table name
          localField: "zones_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "zones_info", // alias for userinfo table
        },
      },
      { $unwind: "$zones_info" },

      {
        $project: {
          _id: 1,
          name: 1,
          circle_no: 1,
          zone_name: "$zones_info.name",
        },
      },
    ]);
    //  console.log(circle_details);
    let final_details = [];
    await Promise.all(
      circle_details.map(async (val, index) => {
        let cir_obj = {
          id: val._id,
          zone: val.zone_name,
          circle: val.circle_no + "-" + val.name,
        };
        let vehicle_count = await Vehicle_attendance.find({
          date: formatted_date,
          circles_id: val._id,
          vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        }).countDocuments();
        //  console.log(vehicle_count);
        cir_obj["total_vehicles"] = vehicle_count;
        let before_6 = await Vehicle_attendance.find({
          date: {
            $lt: new Date(formatted_date + "T14:37:12.848Z"),
          },
          circles_id: ObjectId(val._id),
          date: formatted_date,
          vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          attandance: 1,
        }).countDocuments();
        cir_obj["before_6"] = before_6;
        let after_6 = await Vehicle_attendance.find({
          date: {
            $gt: new Date(formatted_date + "T14:37:12.848Z"),
          },
          circles_id: ObjectId(val._id), 
          date: formatted_date,
          vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          attandance: 1,
        }).countDocuments();
        cir_obj["after_6"] = after_6;
        cir_obj["total"] = before_6 + after_6;
        cir_obj["index"] = index;
        final_details.push(cir_obj);
      })
    );
    final_details.sort((a, b) => {
      return a.index - b.index;
    });
    final_details.map((val) => {
      delete val.index;
    });

    return res
      .status(200)
      .send({ login: true, status: true, data: final_details });
  } else {
    // console.log('not admin');
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id,
    }).exec();
    let acc_circles = [];
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });
    console.log(acc_circles);
    const circle_details = await Circles.aggregate([
      {
        $match: { _id: { $in: acc_circles } },
      },
      {
        $lookup: {
          from: "zones", // other table name
          localField: "zones_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "zones_info", // alias for userinfo table
        },
      },
      { $unwind: "$zones_info" },

      {
        $project: {
          _id: 1,
          name: 1,
          circle_no: 1,
          zone_name: "$zones_info.name",
        },
      },
    ]);
    //  console.log(circle_details);
    let final_details = [];
    await Promise.all(
      circle_details.map(async (val, index) => {
        let cir_obj = {
          id: val._id,
          zone: val.zone_name,
          circle: val.circle_no + "-" + val.name,
        };
        let vehicle_count = await Vehicle_attendance.find({
          date: formatted_date,
          circles_id: val._id,
          vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        }).countDocuments();
        //  console.log(vehicle_count);
        cir_obj["total_vehicles"] = vehicle_count;
        let before_6 = await Vehicle_attendance.find({
          date: {
            $lt: new Date(formatted_date + "T14:37:12.848Z"),
          },
          circles_id: ObjectId(val._id),
          date: formatted_date,
          vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          attandance: 1,
        }).countDocuments();
        cir_obj["before_6"] = before_6;
        let after_6 = await Vehicle_attendance.find({
          date: {
            $gt: new Date(formatted_date + "T14:37:12.848Z"),
          },
          circles_id: ObjectId(val._id),
          date: formatted_date,
          vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          attandance: 1,
        }).countDocuments();
        cir_obj["after_6"] = after_6;
        cir_obj["total"] = before_6 + after_6;
        cir_obj["index"] = index;
        final_details.push(cir_obj);
      })
    );
    final_details.sort((a, b) => {
      return a.index - b.index;
    });
    final_details.map((val) => {
      delete val.index;
    });

    return res
      .status(200)
      .send({ login: true, status: true, data: final_details });
  }
};
