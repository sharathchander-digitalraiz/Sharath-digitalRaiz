const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicles_attendance = require("../../../model/vehicles_attandance");
const Transfer_station = require("../../../model/transferstation");
const Zones = require("../../../model/zones");
const Circles = require("../../../model/circles");
const Useraccess = require("../../../model/useraccess");

exports.circle_sat_transport_attendance = async (req, res) => {
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

    const zones_details = await Zones.find({ tenent_id: tenent_id }).exec();
    // console.log(zone_details)
    let final_array = [];
    await Promise.all(
      zones_details.map(async (val) => {
        let obj = { zone_name: val.name };
        obj["circle_details"] = [];
        const circle_details = await Circles.find({ zones_id: val._id }).exec();
        // console.log(circle_details)
        await Promise.all(
          circle_details.map(async (val) => {
            let cir_obj = { circle_no: val.circle_no, circle_name: val.name };
            const ghmc_attendance = await Vehicles_attendance.find({
              circles_id: val._id,
              owner_type: "GHMC",
              vehicle_type: "GHMC Swatch Auto",
              date: formatted_date,
              attandance: 1,
            }).countDocuments();
            const private_attendance = await Vehicles_attendance.find({
              circles_id: val._id,
              owner_type: "Private",
              vehicle_type: "Private Swatch Auto",
              date: formatted_date,
              attandance: 1,
            }).countDocuments();
            cir_obj["ghmc_attendance"] = ghmc_attendance;
            cir_obj["private_attendance"] = private_attendance;

            const ghmc_transfer_att = await Transfer_station.aggregate([
              {
                $match: {
                  date: formatted_date,
                  circle_id: val._id,
                  vechile_type: "GHMC Swatch Auto",
                },
              },
              {
                $group: { _id: "$import_data_unique_no" },
              },
            ]);
            //  console.log(ghmc_transfer_att)
            cir_obj["ghmc_transfer_att"] = ghmc_transfer_att.length;

            const private_transfer_att = await Transfer_station.aggregate([
              {
                $match: {
                  date: formatted_date,
                  circle_id: val._id,
                  vechile_type: "Private Swatch Auto",
                },
              },
              {
                $group: { _id: "$import_data_unique_no" },
              },
            ]);

            cir_obj["private_transfer_att"] = private_transfer_att.length;
            obj["circle_details"].push(cir_obj);
          })
        );
        final_array.push(obj);
      })
    );
    //console.log()
    return res
      .status(200)
      .send({ login: true, success: true, data: final_array });
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
    // console.log(zone_details)
    let final_array = [];
    await Promise.all(
      zones_details.map(async (val) => {
        let obj = { zone_name: val.name };
        obj["circle_details"] = [];
        const circle_details = await Circles.find({
          zones_id: val._id,
          _id: { $in: acc_circles },
        }).exec();
        // console.log(circle_details)
        await Promise.all(
          circle_details.map(async (val) => {
            let cir_obj = { circle_no: val.circle_no, circle_name: val.name };
            const ghmc_attendance = await Vehicles_attendance.find({
              circles_id: val._id,
              owner_type: "GHMC",
              vehicle_type: "GHMC Swatch Auto",
              date: formatted_date,
              attandance: 1,
            }).countDocuments();
            const private_attendance = await Vehicles_attendance.find({
              circles_id: val._id,
              owner_type: "Private",
              vehicle_type: "Private Swatch Auto",
              date: formatted_date,
              attandance: 1,
            }).countDocuments();
            cir_obj["ghmc_attendance"] = ghmc_attendance;
            cir_obj["private_attendance"] = private_attendance;

            const ghmc_transfer_att = await Transfer_station.aggregate([
              {
                $match: {
                  date: formatted_date,
                  circle_id: val._id,
                  vechile_type: "GHMC Swatch Auto",
                },
              },
              {
                $group: { _id: "$import_data_unique_no" },
              },
            ]);
            //  console.log(ghmc_transfer_att)
            cir_obj["ghmc_transfer_att"] = ghmc_transfer_att.length;

            const private_transfer_att = await Transfer_station.aggregate([
              {
                $match: {
                  date: formatted_date,
                  circle_id: val._id,
                  vechile_type: "Private Swatch Auto",
                },
              },
              {
                $group: { _id: "$import_data_unique_no" },
              },
            ]);

            cir_obj["private_transfer_att"] = private_transfer_att.length;
            obj["circle_details"].push(cir_obj);
          })
        );
        final_array.push(obj);
      })
    );
    //console.log()
    return res
      .status(200)
      .send({ login: true, success: true, data: final_array });
  }
};
