const Vehicles = require("../../../model/vehicles");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const Transfer_station = require("../../../model/transferstation");
const Useraccess = require("../../../model/useraccess");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.transfer_sat_att_trips = async (req, res) => {
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
  // console.log(current_datetime);
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

    const vehicle_details = await Vehicles.find({
      tenent_id: tenent_id,
      vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
    }).exec();
    //  console.log(vehicle_details);
    let final_trips = [];
    let i = 0;
    await Promise.all(
      vehicle_details.map(async (details, index) => {
        const trips_count = await Transfer_station.find({
          date: formatted_date,
          import_data_unique_no: details.unique_no,
        }).countDocuments();

        final_trips[i] = {};
        final_trips[i].id = details._id;
        final_trips[i].zone = details.zone;
        final_trips[i].circle = details.circle_no + "-" + details.circle;
        final_trips[i].sfa_name = details.incharge;
        final_trips[i].vehicle_registration_number =
          details.vehicle_registration_number;
        final_trips[i].transfer_station = details.transfer_station;
        final_trips[i].owner_type = details.owner_type;
        final_trips[i].vehicle_type = details.vehicle_type;
        final_trips[i].unique_no = details.unique_no;
        final_trips[i].trips_count = trips_count;
        final_trips[i].index = index;

        // console.log(trips_count);

        i++;
      })
    );

    final_trips.sort((a, b) => {
      return a.index - b.index;
    });

    final_trips.map((a) => {
      delete a.index;
    });
    return res
      .status(200)
      .send({ login: true, status: false, data: final_trips });
  } else {
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id,
    }).exec();
    let acc_circles = [];
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });
    //console.log(acc_circles);
    const vehicle_details = await Vehicles.find({
      circles_id: acc_circles,
      vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
    }).exec();
    //  console.log(vehicle_details);
    let final_trips = [];
    let i = 0;
    await Promise.all(
      vehicle_details.map(async (details, index) => {
        const trips_count = await Transfer_station.find({
          date: formatted_date,
          import_data_unique_no: details.unique_no,
        }).countDocuments();

        final_trips[i] = {};
        final_trips[i].id = details._id;
        final_trips[i].zone = details.zone;
        final_trips[i].circle = details.circle_no + "-" + details.circle;
        final_trips[i].sfa_name = details.incharge;
        final_trips[i].vehicle_registration_number =
          details.vehicle_registration_number;
        final_trips[i].transfer_station = details.transfer_station;
        final_trips[i].owner_type = details.owner_type;
        final_trips[i].vehicle_type = details.vehicle_type;
        final_trips[i].unique_no = details.unique_no;
        final_trips[i].trips_count = trips_count;
        final_trips[i].index = index;

        // console.log(trips_count);

        i++;
      })
    );

    final_trips.sort((a, b) => {
      return a.index - b.index;
    });

    final_trips.map((a) => {
      delete a.index;
    });
    return res
      .status(200)
      .send({ login: true, status: false, data: final_trips });
  }
};
