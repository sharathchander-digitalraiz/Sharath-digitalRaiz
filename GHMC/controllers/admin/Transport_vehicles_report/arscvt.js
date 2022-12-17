const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicles = require("../../../model/vehicles");
const Vehicles_attendance = require("../../../model/vehicles_attandance");
const Useraccess = require("../../../model/useraccess");
const Zones = require("../../../model/zones");
const Circles = require("../../../model/circles");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.arscvt = async (req, res) => {
  const { user_id, tenent_id, date_search } = req.body;

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
  let formatted_date;
  console.log(date_search + "hrllo");
  console.log("date_search");
  if (empty(date_search)) {
    console.log("date_search2");
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
      return res
        .status(400)
        .send({ login: true, status: false, message: "Tenent id is required" });
    }
    // const circles_details = await Circles.find({tenent_id:tenent_id},{_id:1,name:1,circle_no:1}).sort( { circle_no: 1 } ).exec();
    const zones_details = await Zones.find(
      { tenent_id: tenent_id },
      { name: 1 }
    )
      .sort({ name: 1 })
      .sort({ name: 1 })
      .exec();
    const circle_time_details = [];

    await Promise.all(
      zones_details.map(async (val, index) => {
        let obj = {};
        obj["zone_details"] = val.name;
        const circles_details = await Circles.find(
          { zones_id: val._id, tenent_id: tenent_id },
          { _id: 1, name: 1, circle_no: 1 }
        )
          .sort({ circle_no: 1 })
          .exec();

        obj["circle_details"] = [];
        await Promise.all(
          circles_details.map(async (cir_val, index) => {
            let circle_obj = {
              circle_no: cir_val.circle_no,
              circle_name: cir_val.name,
            };
            let vehicle_cir_count = await Vehicles_attendance.find({
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
            }).countDocuments();
            circle_obj["total_veh"] = vehicle_cir_count;
            let before_5 = await Vehicles_attendance.find({
              log_date_created: {
                $lt: new Date(formatted_date + "T13:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            //  console.log(before_5);
            circle_obj["before_5"] = before_5;
            let before_6 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
                $lt: new Date(formatted_date + "T14:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_6"] = before_6;
            let before_7 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
                $lt: new Date(formatted_date + "T15:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_7"] = before_7;
            let before_8 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
                $lt: new Date(formatted_date + "T16:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_8"] = before_8;
            let before_9 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_9"] = before_9;
            let vehicle_pres_count = await Vehicles_attendance.find({
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $in: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["vehicle_pres_count"] = vehicle_pres_count;
            obj["circle_details"].push(circle_obj);
          })
        );
        circle_time_details.push(obj);
      })
    );
    // circle_time_details.sort((a, b) => {
    //     return a.circle_no - b.circle_no;
    // });
    //  var foo = new Date(formatted_date+'T13:37:12.848Z');
    //  console.log(foo)
    //  var get_hour = foo.getHours();
    //   console.log(get_hour)

    return res
      .status(200)
      .send({ login: true, status: true, data: circle_time_details });
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

    const zones_details = await Zones.find(
      { _id: { $in: acc_zones } },
      { name: 1 }
    )
      .sort({ name: 1 })
      .sort({ name: 1 })
      .exec();
    // console.log(zones_details);
    const circle_time_details = [];

    await Promise.all(
      zones_details.map(async (val, index) => {
        let obj = {};
        obj["zone_details"] = val.name;
        const circles_details = await Circles.find(
          { zones_id: val._id, _id: { $in: acc_circles } },
          { _id: 1, name: 1, circle_no: 1 }
        )
          .sort({ circle_no: 1 })
          .exec();

        obj["circle_details"] = [];
        await Promise.all(
          circles_details.map(async (cir_val, index) => {
            let circle_obj = {
              circle_no: cir_val.circle_no,
              circle_name: cir_val.name,
            };
            let vehicle_cir_count = await Vehicles_attendance.find({
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
            }).countDocuments();
            circle_obj["total_veh"] = vehicle_cir_count;
            let before_5 = await Vehicles_attendance.find({
              log_date_created: {
                $lt: new Date(formatted_date + "T13:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            //  console.log(before_5);
            circle_obj["before_5"] = before_5;
            let before_6 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
                $lt: new Date(formatted_date + "T14:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_6"] = before_6;
            let before_7 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
                $lt: new Date(formatted_date + "T15:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_7"] = before_7;
            let before_8 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
                $lt: new Date(formatted_date + "T16:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_8"] = before_8;
            let before_9 = await Vehicles_attendance.find({
              log_date_created: {
                $gt: new Date(formatted_date + "T13:37:12.848Z"),
              },
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $nin: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["before_9"] = before_9;
            let vehicle_pres_count = await Vehicles_attendance.find({
              circles_id: ObjectId(cir_val._id),
              date: formatted_date,
              vehicle_type: {
                $in: ["GHMC Swatch Auto", "Private Swatch Auto"],
              },
              attandance: 1,
            }).countDocuments();
            circle_obj["vehicle_pres_count"] = vehicle_pres_count;
            obj["circle_details"].push(circle_obj);
          })
        );
        circle_time_details.push(obj);
      })
    );
    // circle_time_details.sort((a, b) => {
    //     return a.circle_no - b.circle_no;
    // });
    //  var foo = new Date(formatted_date+'T13:37:12.848Z');
    //  console.log(foo)
    //  var get_hour = foo.getHours();
    //   console.log(get_hour)

    return res
      .status(200)
      .send({ login: true, status: true, data: circle_time_details });
  }
};
