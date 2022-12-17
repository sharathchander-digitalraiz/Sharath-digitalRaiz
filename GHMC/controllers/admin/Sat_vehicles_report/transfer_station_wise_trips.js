const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicles = require("../../../model/vehicles");
const Transfer_station = require("../../../model/transferstation");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.transfer_station_wise_trips = async (req, res) => {
  // console.log(req.body);
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

    const user_details = await User.find(
      { department_id: ObjectId("618588f8a5d1f1e87a1f6bb3") },
      { _id: 1, first_name: 1, last_name: 1 }
    ).exec();
    //  console.log(user_details)
    let transfer_array = [];
    await Promise.all(
      user_details.map(async (val, index) => {
        let transfer_obj = {
          id: val._id,
          transfer_station: val.first_name + "-" + val.last_name,
        };

        /* GHMC */
        let vehicle_transfer_details = await Vehicles.find(
          {
            owner_type: "GHMC",
            transfer_station_id: val._id,
            vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          },
          { unique_no: 1 }
        ).exec();
        //console.log(vehicle_transfer_details);
        transfer_obj["GHMC"] = [];
        let sum = [];
        let sum_trips = [];
        let wastage_weight = [];
        await Promise.all(
          vehicle_transfer_details.map(async (val, index) => {
            let count_trips = await Transfer_station.find({
              date: formatted_date,
              import_data_unique_no: val.unique_no,
            }).countDocuments();
            // console.log(count_trips);
            sum_trips.push(count_trips);
            let trips_details = await Transfer_station.aggregate([
              {
                $match: {
                  date: formatted_date,
                  import_data_unique_no: val.unique_no,
                },
              },
              {
                $group: { _id: 1, TotalAmount: { $sum: "$wastage_weight" } },
              },
            ]);
            // console.log(trips_details);
            if (trips_details.length > 0) {
              wastage_weight.push(trips_details[0]["TotalAmount"]);
            } else {
              wastage_weight.push(0);
            }
            sum.push(trips_details.length);
          })
        );
        let sum_result_trips = sum_trips.reduce(function (a, b) {
          return a + b;
        }, 0);

        let sum_result = sum.reduce(function (a, b) {
          return a + b;
        }, 0);

        //console.log(wastage_weight);

        let sum_wastage = wastage_weight.reduce(function (a, b) {
          return a + b;
        }, 0);

        let ghmc_obj = {};
        ghmc_obj["total_trips"] = sum_result_trips;
        ghmc_obj["attend_veh"] = sum_result;
        ghmc_obj["garbage_wt"] = sum_wastage;
        transfer_obj["GHMC"].push(ghmc_obj);

        /* PRIVATE */
        let vehicle_private_details = await Vehicles.find(
          {
            owner_type: "Private",
            transfer_station_id: val._id,
            vehicle_type: { $nin: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          },
          { unique_no: 1 }
        ).exec();
        // console.log(vehicle_private_details);

        transfer_obj["Private"] = [];
        let sum_private = [];
        let sum_trips_private = [];
        let wastage_weight_private = [];

        await Promise.all(
          vehicle_private_details.map(async (val, index) => {
            let count_trips_private = await Transfer_station.find({
              date: formatted_date,
              import_data_unique_no: val.unique_no,
            }).countDocuments();
            // console.log(count_trips);
            sum_trips_private.push(count_trips_private);
            let trips_details_private = await Transfer_station.aggregate([
              {
                $match: {
                  date: formatted_date,
                  import_data_unique_no: val.unique_no,
                },
              },
              {
                $group: { _id: 1, TotalAmount: { $sum: "$wastage_weight" } },
              },
            ]);
            // console.log(trips_details_private);
            if (trips_details_private.length > 0) {
              wastage_weight_private.push(
                trips_details_private[0]["TotalAmount"]
              );
            } else {
              wastage_weight_private.push(0);
            }
            sum_private.push(trips_details_private.length);
          })
        );

        let sum_result_trips_p = sum_trips_private.reduce(function (a, b) {
          return a + b;
        }, 0);

        let sum_result_p = sum_private.reduce(function (a, b) {
          return a + b;
        }, 0);

        //console.log(wastage_weight);

        let sum_wastage_p = wastage_weight_private.reduce(function (a, b) {
          return a + b;
        }, 0);
        let private_obj = {};
        private_obj["total_trips"] = sum_result_trips_p;
        private_obj["attend_veh"] = sum_result_p;
        private_obj["garbage_wt"] = sum_wastage_p;
        transfer_obj["Private"].push(private_obj);

        transfer_array.push(transfer_obj);
      })
    );

    return res
      .status(200)
      .send({ login: true, status: true, data: transfer_array });
  }
};
