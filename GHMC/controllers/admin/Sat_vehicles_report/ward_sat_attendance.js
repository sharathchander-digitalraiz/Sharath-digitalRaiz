const Wards = require("../../../model/wards");
const Vehicle_attendance = require("../../../model/vehicles_attandance");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const Useraccess = require("../../../model/useraccess");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.ward_sat_attendance = async (req, res) => {
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

  //console.log('hii');
  if (role_data.name == "Admin") {
    if (tenent_id == "" || tenent_id == undefined) {
      return res
        .status(400)
        .send({ login: true, status: false, message: "Tenent id is required" });
    }
    const ward_details = await Wards.aggregate([
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
        $lookup: {
          from: "circles", // other table name
          localField: "circles_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "circle_info", // alias for userinfo table
        },
      },
      { $unwind: "$circle_info" },
      {
        $project: {
          _id: 1,
          name: 1,
          zone_name: "$zones_info.name",
          circle_name: "$circle_info.name",
        },
      },
    ]);

    //console.log(ward_details);
    const final_attendance = [];

    await Promise.all(
      ward_details.map(async (details, index) => {
        let ward_obj = {
          id: details._id,
          zone: details.zone_name,
          circle: details.circle_name,
          ward: details.name,
        };
        const ward_count = await Vehicle_attendance.find({
          ward_id: details._id,
          date: formatted_date,
          vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        }).countDocuments();
        const ward_attend = await Vehicle_attendance.find({
          attandance: 1,
          ward_id: details._id,
          date: formatted_date,
          vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        }).countDocuments();
        // console.log(ward_attend);
        ward_obj["total_vehicles"] = ward_count;
        ward_obj["total_present"] = ward_attend;
        ward_obj["total_abscent"] = ward_count - ward_attend;
        ward_obj["index"] = index;
        final_attendance.push(ward_obj);
      })
    );

    final_attendance.sort((a, b) => {
      return a.index - b.index;
    });
    final_attendance.map((obj) => {
      delete obj.index;
    });
    //  console.log(final_attendance.length);
    return res
      .status(200)
      .send({ login: true, status: true, data: final_attendance });
  } else {
    //  console.log('not admin');
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id,
    }).exec();
    let acc_circles = [];
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });
    console.log(acc_circles);
    const ward_details = await Wards.aggregate([
      {
        $match: { circles_id: { $in: acc_circles } },
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
        $lookup: {
          from: "circles", // other table name
          localField: "circles_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "circle_info", // alias for userinfo table
        },
      },
      { $unwind: "$circle_info" },
      {
        $project: {
          _id: 1,
          name: 1,
          zone_name: "$zones_info.name",
          circle_name: "$circle_info.name",
        },
      },
    ]);

    //console.log(ward_details);
    const final_attendance = [];

    await Promise.all(
      ward_details.map(async (details, index) => {
        let ward_obj = {
          id: details._id,
          zone: details.zone_name,
          circle: details.circle_name,
          ward: details.name,
        };
        const ward_count = await Vehicle_attendance.find({
          ward_id: details._id,
          date: formatted_date,
          vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        }).countDocuments();
        const ward_attend = await Vehicle_attendance.find({
          attandance: 1,
          ward_id: details._id,
          date: formatted_date,
          vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
        }).countDocuments();
        // console.log(ward_attend);
        ward_obj["total_vehicles"] = ward_count;
        ward_obj["total_present"] = ward_attend;
        ward_obj["total_abscent"] = ward_count - ward_attend;
        ward_obj["index"] = index;
        final_attendance.push(ward_obj);
      })
    );

    final_attendance.sort((a, b) => {
      return a.index - b.index;
    });
    final_attendance.map((obj) => {
      delete obj.index;
    });
    //  console.log(final_attendance.length);
    return res
      .status(200)
      .send({ login: true, status: true, data: final_attendance });
  }
};
