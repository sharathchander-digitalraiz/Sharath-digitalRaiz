const Vehicles_attandances = require("../../model/vehicles_attandance");
const User = require("../../model/users");
const Department = require("../../model/department");
const Useraccess = require("../../model/useraccess");
const Zone = require("../../model/zones");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.get_reports_vehicle_attendance = async (req, res) => {
  const { user_id, tenent_id } = req.body;
  if (user_id == "" || user_id == undefined) {
    return res
      .status(400)
      .send({ login: true, success: false, message: "User id is required" });
  }
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

  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { user_access_id: 1, department_id: 1 }
  ).exec();
  //console.log(acc_dep_data);
  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );
  if (role_data.name == "Admin") {
    let newobject = {};
    newobject.tenent_id = ObjectId("618f8d2f7bf1ba171f8f35da");
    newobject.date = formatted_date;
    const alldata = await Vehicles_attandances.aggregate([
      { $match: newobject },
      {
        $lookup: {
          from: "zones",
          localField: "zones_id",
          foreignField: "_id",
          as: "zones_info"
        }
      },
      { $unwind: "$zones_info" },
      {
        $lookup: {
          from: "circles",
          localField: "circles_id",
          foreignField: "_id",
          as: "circle_info"
        }
      },
      { $unwind: "$circle_info" },
      {
        $lookup: {
          from: "wards",
          localField: "ward_id",
          foreignField: "_id",
          as: "wards_info"
        }
      },
      { $unwind: "$wards_info" },
      // {
      //     $lookup:{
      //         from: "areas",
      //         localField: "areas_id",
      //         foreignField: "_id",
      //         as: "areas_info"
      //     }
      // },
      // {   $unwind:"$areas_info" },
      {
        $lookup: {
          from: "landmarks",
          localField: "landmark_id",
          foreignField: "_id",
          as: "landmark_info"
        }
      },
      { $unwind: "$landmark_info" },
      // {
      //     $lookup:{
      //         from: "vehicles",
      //         localField: "vehicle_unique_no",
      //         foreignField: "unique_no",
      //         as: "vehicle_info"
      //     }
      // },
      // {   $unwind:"$vehicle_info" },

      {
        $project: {
          _id: 1,
          zone_name: "$zones_info.name",
          circle_name: "$circle_info.name",
          wardname: {
            $concat: ["$wards_info.wards_no", " - ", "$wards_info.name"]
          },
          area_name: "$areas_info.name",
          landmark_name: {
            $concat: [
              "$landmark_info.landmark_from",
              " - ",
              "$landmark_to.name"
            ]
          },
          vehicle_type: 1,
          scanned_address: 1,
          log_date_created: 1,
          date: 1,
          latitude: 1,
          longitude: 1,
          scan_image: 1,
          attandance: 1,
          sfa_name: 1,
          incharge: 1,
          incharge_mobile_number: 1,
          vehicle_registration_number: 1,
          owner_type: 1
          // driver_name : "$vehicle_info.driver_name",
          // driver_mobile : "$vehicle_info.driver_number",
          // landmark:"$vehicle_info.location",
          // Transfer_station:"$vehicle_info.transfer_station",
        }
      }
    ]);

    // console.log(alldata);
    return res.status(200).send({ login: true, status: true, data: alldata });
  } else {
    const access_data = await Useraccess.findOne({
      _id: acc_dep_data.user_access_id
    }).exec();
    console.log(access_data);
    let acc_zones = [];
    let acc_circles = [];
    let acc_wards = [];
    let acc_areas = [];
    let acc_landmark = [];
    acc_zones = access_data["zones"].map((val) => {
      return ObjectId(val);
    });
    acc_circles = access_data["circles"].map((val) => {
      return ObjectId(val);
    });
    acc_wards = access_data["ward"].map((val) => {
      return ObjectId(val);
    });
    // acc_areas = access_data['areas'].map((val)=>{
    //     return ObjectId(val)
    // })
    acc_landmark = access_data["landmarks"].map((val) => {
      return ObjectId(val);
    });
    console.log();
    let newobject = {};
    newobject.date = formatted_date;
    newobject.zones_id = { $in: acc_zones };
    newobject.circles_id = { $in: acc_circles };
    newobject.ward_id = { $in: acc_wards };
    // newobject.areas_id = {$in: acc_areas};
    newobject.landmark_id = { $in: acc_landmark };
    const alldata = await Vehicles_attandances.aggregate([
      { $match: newobject },
      {
        $lookup: {
          from: "zones",
          localField: "zones_id",
          foreignField: "_id",
          as: "zones_info"
        }
      },
      { $unwind: "$zones_info" },
      {
        $lookup: {
          from: "circles",
          localField: "circles_id",
          foreignField: "_id",
          as: "circle_info"
        }
      },
      { $unwind: "$circle_info" },
      {
        $lookup: {
          from: "wards",
          localField: "ward_id",
          foreignField: "_id",
          as: "wards_info"
        }
      },
      { $unwind: "$wards_info" },
      // {
      //     $lookup:{
      //         from: "areas",
      //         localField: "areas_id",
      //         foreignField: "_id",
      //         as: "areas_info"
      //     }
      // },
      // {   $unwind:"$areas_info" },
      {
        $lookup: {
          from: "landmarks",
          localField: "landmark_id",
          foreignField: "_id",
          as: "landmark_info"
        }
      },
      { $unwind: "$landmark_info" },
      // {
      //     $lookup:{
      //         from: "vehicles",
      //         localField: "vehicle_unique_no",
      //         foreignField: "unique_no",
      //         as: "vehicle_info"
      //     }
      // },
      // {   $unwind:"$vehicle_info" },
      {
        $project: {
          _id: 1,
          zone_name: "$zones_info.name",
          circle_name: "$circle_info.name",
          wardname: {
            $concat: ["$wards_info.wards_no", " - ", "$wards_info.name"]
          },
          area_name: "$areas_info.name",
          landmark_name: {
            $concat: [
              "$landmark_info.landmark_from",
              " - ",
              "$landmark_to.name"
            ]
          },
          vehicle_type: 1,
          scanned_address: 1,
          log_date_created: 1,
          date: 1,
          latitude: 1,
          longitude: 1,
          scan_image: 1,
          attandance: 1,
          sfa_name: 1,
          incharge: 1,
          incharge_mobile_number: 1,
          vehicle_registration_number: 1,
          owner_type: 1
          // driver_name : "$vehicle_info.driver_name",
          // driver_mobile : "$vehicle_info.driver_number",
          // landmark:"$vehicle_info.location",
          // Transfer_station:"$vehicle_info.transfer_station",
        }
      }
    ]);
    //console.log(alldata);
    return res.status(200).send({ login: true, status: true, data: alldata });
  }
};

exports.get_reports_search_vehicle_attendance = async (req, res) => {
  const { user_id } = req.body;
  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { user_access_id: 1, department_id: 1 }
  ).exec();
  // console.log(acc_dep_data);
  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );
  let dates_search;
  let array_table = [
    "Zone name",
    "Circle name",
    "Ward",
    "Incharge",
    "Incharge Mobile No.",
    "Vehicle Registration No.",
    "Owner type",
    "Vehicle type",
    "Driver Name",
    "Driver No",
    "Landmark",
    "Transfer station"
  ];

  if (role_data.name == "Admin") {
    const addDays = (date, days = 1) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const dateRange = (start, end, range = []) => {
      if (start > end) return range;
      const next = addDays(start, 1);
      return dateRange(next, end, [...range, start]);
    };
    // let newDate = req.body.reportrange.split("-");
    const range = dateRange(new Date("2021-11-23"), new Date("2021-11-25"));
    let arrDate = range.map((date) => date.toISOString().slice(0, 10));
    dates_search = arrDate;

    let newobject = {};
    //  newobject.tenent_id = ObjectId('618f8d2f7bf1ba171f8f35da');
    if (req.body.attendance != "") {
      newobject["attandance"] = { $in: [Number(req.body.attendance)] };
    }
    if (req.body.zones_id != "") {
      newobject["zones_id"] = { $in: [ObjectId(req.body.zones_id)] };
    }
    if (req.body.circles_id != "") {
      newobject["circles_id"] = { $in: [ObjectId(req.body.circles_id)] };
    }
    if (req.body.ward_id != "") {
      newobject["ward_id"] = { $in: [ObjectId(req.body.ward_id)] };
    }
    if (req.body.areas_id != "") {
      newobject["areas_id"] = { $in: [ObjectId(req.body.areas_id)] };
    }
    if (req.body.landmark_id != "") {
      newobject["landmark_id"] = { $in: [ObjectId(req.body.landmark_id)] };
    }
    newobject.date = dates_search[0];
    const vehicle_details = await Vehicles_attandances.aggregate([
      { $match: newobject },
      {
        $lookup: {
          from: "zones",
          localField: "zones_id",
          foreignField: "_id",
          as: "zones_info"
        }
      },
      { $unwind: "$zones_info" },
      {
        $lookup: {
          from: "circles",
          localField: "circles_id",
          foreignField: "_id",
          as: "circle_info"
        }
      },
      { $unwind: "$circle_info" },
      {
        $lookup: {
          from: "wards",
          localField: "ward_id",
          foreignField: "_id",
          as: "wards_info"
        }
      },
      { $unwind: "$wards_info" },
      // {
      //     $lookup:{
      //         from: "areas",
      //         localField: "areas_id",
      //         foreignField: "_id",
      //         as: "areas_info"
      //     }
      // },
      // {   $unwind:"$areas_info" },
      {
        $lookup: {
          from: "landmarks",
          localField: "landmark_id",
          foreignField: "_id",
          as: "landmark_info"
        }
      },
      { $unwind: "$landmark_info" },
      // {
      //     $lookup:{
      //         from: "vehicles",
      //         localField: "vehicle_unique_no",
      //         foreignField: "unique_no",
      //         as: "vehicle_info"
      //     }
      // },
      // {   $unwind:"$vehicle_info" },

      {
        $project: {
          _id: 1,
          zone_name: "$zones_info.name",
          circle_name: "$circle_info.name",
          wardname: {
            $concat: ["$wards_info.wards_no", " - ", "$wards_info.name"]
          },
          area_name: "$areas_info.name",
          landmark_name: {
            $concat: [
              "$landmark_info.landmark_from",
              " - ",
              "$landmark_to.name"
            ]
          },
          vehicle_type: 1,
          scanned_address: 1,
          log_date_created: 1,
          date: 1,
          latitude: 1,
          longitude: 1,
          scan_image: 1,
          attandance: 1,
          sfa_name: 1,
          incharge: 1,
          incharge_mobile_number: 1,
          vehicle_registration_number: 1,
          owner_type: 1
          // driver_name : "$vehicle_info.driver_name",
          // driver_mobile : "$vehicle_info.driver_number",
          // landmark:"$vehicle_info.location",
          // Transfer_station:"$vehicle_info.transfer_station",
        }
      }
    ]);

    async function processvehicle_attendance(data) {
      let finaldata = [];
      await Promise.all(
        vehicle_details.map(async (val) => {
          let obj_result = {
            zone_name: val.zone_name,
            circle_name: val.circle_name,
            ward_name: val.wardname,
            area_name: "",
            incharge: val.incharge,
            incharge_mobile_number: val.incharge_mobile_number,
            vehicle_registration_number: val.vehicle_registration_number,
            owner_type: val.owner_type,
            driver_name: "",
            driver_mobile: "",
            landmark_name: val.landmark_name,
            transfer_station: "",
            vehicle_type: val.vehicle_type
          };
          let r = {};
          await Promise.all(
            dates_search.map(async (dates) => {
              console.log(dates);

              if (req.body.attendance == "") {
                await Vehicles_attandances.findOne(
                  {
                    date: dates,
                    vehicle_registration_number: val.vehicle_registration_number
                  },
                  { attandance: 1 }
                )
                  .exec()
                  .then((count) => {
                    var da = dates;
                    console.log(count);
                    //console.log(count+'----'+da);

                    r[da] = count.attandance;
                    // console.log(obj)
                  });
              } else if (req.body.attendance != "") {
                let newobject2 = {};
                newobject2["attandance"] = {
                  $in: [Number(req.body.attendance)]
                };
                newobject2["date"] = dates;
                newobject2["vehicle_registration_number"] =
                  val.vehicle_registration_number;
                await Vehicles_attandances.findOne(newobject2)
                  .countDocuments()
                  .then((count) => {
                    var da = dates;
                    if (count != 0) {
                      r[da] = req.body.attendance;
                    } else {
                      obj_result = {};
                      r = {};
                    }
                    // console.log(obj)
                  });
              }
            })
          );
          console.log(obj_result);
          console.log(Object.keys(obj_result).length == 0);
          //console.log(r);
          if (!Object.keys(obj_result).length == 0) {
            let obj_result1 = {};
            obj_result1["scanned_address"] = val.scanned_address;
            obj_result1["latitude"] = val.latitude;
            obj_result1["longitude"] = val.longitude;
            obj_result1["scan_image"] = val.scan_image;
            finaldata.push({ ...obj_result, ...r, ...obj_result1 });
          }
        })
      );
      const filtered = finaldata.filter((e) => Object.keys(e).length);
      return filtered;
    }
    let userToken = processvehicle_attendance(1);

    userToken.then(function (result) {
      //  console.log(result) // "Some User token"
      dates_search.forEach((da, dind) => {
        array_table.push(da);
      });

      array_table.push("Address");
      array_table.push("Latitude");
      array_table.push("Longitude");
      array_table.push("Image");
      console.log("not admin");
      res
        .status(200)
        .send({ success: true, data: { result: result, table: array_table } });
    });
  } else {
    const addDays = (date, days = 1) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const dateRange = (start, end, range = []) => {
      if (start > end) return range;
      const next = addDays(start, 1);
      return dateRange(next, end, [...range, start]);
    };
    // let newDate = req.body.reportrange.split("-");
    const range = dateRange(new Date("2021-12-15"), new Date("2021-12-16"));
    let arrDate = range.map((date) => date.toISOString().slice(0, 10));
    dates_search = arrDate;
    let newobject = {};
    newobject.date = dates_search[0];
    if (req.body.zones_id != "") {
      newobject["zones_id"] = { $in: [ObjectId(req.body.zones_id)] };
    }
    if (req.body.circles_id != "") {
      newobject["circles_id"] = { $in: [ObjectId(req.body.circles_id)] };
    }
    if (req.body.ward_id != "") {
      newobject["ward_id"] = { $in: [ObjectId(req.body.ward_id)] };
    }
    if (req.body.areas_id != "") {
      newobject["areas_id"] = { $in: [ObjectId(req.body.areas_id)] };
    }
    if (req.body.landmark_id != "") {
      newobject["landmark_id"] = { $in: [ObjectId(req.body.landmark_id)] };
    }
    if (req.body.attendance != "") {
      newobject["attandance"] = { $in: [Number(req.body.attendance)] };
    }

    console.log(newobject);

    const vehicle_details = await Vehicles_attandances.aggregate([
      { $match: newobject },
      {
        $lookup: {
          from: "zones",
          localField: "zones_id",
          foreignField: "_id",
          as: "zones_info"
        }
      },
      { $unwind: "$zones_info" },
      {
        $lookup: {
          from: "circles",
          localField: "circles_id",
          foreignField: "_id",
          as: "circle_info"
        }
      },
      { $unwind: "$circle_info" },
      {
        $lookup: {
          from: "wards",
          localField: "ward_id",
          foreignField: "_id",
          as: "wards_info"
        }
      },
      { $unwind: "$wards_info" },
      // {
      //     $lookup:{
      //         from: "areas",
      //         localField: "areas_id",
      //         foreignField: "_id",
      //         as: "areas_info"
      //     }
      // },
      // {   $unwind:"$areas_info" },
      {
        $lookup: {
          from: "landmarks",
          localField: "landmark_id",
          foreignField: "_id",
          as: "landmark_info"
        }
      },
      { $unwind: "$landmark_info" },
      // {
      //     $lookup:{
      //         from: "vehicles",
      //         localField: "vehicle_unique_no",
      //         foreignField: "unique_no",
      //         as: "vehicle_info"
      //     }
      // },
      // {   $unwind:"$vehicle_info" },

      {
        $project: {
          _id: 1,
          zone_name: "$zones_info.name",
          circle_name: "$circle_info.name",
          wardname: {
            $concat: ["$wards_info.wards_no", " - ", "$wards_info.name"]
          },
          area_name: "$areas_info.name",
          landmark_name: {
            $concat: [
              "$landmark_info.landmark_from",
              " - ",
              "$landmark_to.name"
            ]
          },
          vehicle_type: 1,
          scanned_address: 1,
          log_date_created: 1,
          date: 1,
          latitude: 1,
          longitude: 1,
          scan_image: 1,
          attandance: 1,
          sfa_name: 1,
          incharge: 1,
          incharge_mobile_number: 1,
          vehicle_registration_number: 1,
          owner_type: 1
          // driver_name : "$vehicle_info.driver_name",
          // driver_mobile : "$vehicle_info.driver_number",
          // landmark:"$vehicle_info.location",
          // Transfer_station:"$vehicle_info.transfer_station",
        }
      }
    ]);

    console.log(vehicle_details);

    async function processvehicle_attendance(data) {
      let finaldata = [];
      await Promise.all(
        vehicle_details.map(async (val) => {
          let obj_result = {
            zone_name: val.zone_name,
            circle_name: val.circle_name,
            ward_name: val.wardname,
            area_name: "",
            incharge: val.incharge,
            incharge_mobile_number: val.incharge_mobile_number,
            vehicle_registration_number: val.vehicle_registration_number,
            owner_type: val.owner_type,
            driver_name: "",
            driver_mobile: "",
            landmark_name: val.landmark_name,
            transfer_station: "",
            vehicle_type: val.vehicle_type
          };
          let r = {};
          await Promise.all(
            dates_search.map(async (dates) => {
              //   console.log(dates);

              if (req.body.attendance == "") {
                //console.log(val._id);
                await Vehicles_attandances.findOne(
                  {
                    date: dates,
                    vehicle_registration_number: val.vehicle_registration_number
                  },
                  { attandance: 1 }
                )
                  .exec()
                  .then((count) => {
                    var da = dates;
                    console.log(count);
                    //console.log(count+'----'+da);

                    r[da] = count.attandance;
                    // console.log(obj)
                  });
              } else if (req.body.attendance != "") {
                let newobject2 = {};
                newobject2["attandance"] = {
                  $in: [Number(req.body.attendance)]
                };
                newobject2["date"] = dates;
                newobject2["vehicle_registration_number"] =
                  val.vehicle_registration_number;
                await Vehicles_attandances.findOne(newobject2)
                  .countDocuments()
                  .then((count) => {
                    var da = dates;
                    if (count != 0) {
                      r[da] = req.body.attendance;
                    } else {
                      obj_result = {};
                      r = {};
                    }
                    // console.log(obj)
                  });
              }
            })
          );
          //console.log(r);
          //console.log(obj_result);
          // console.log(Object.keys(obj_result).length==0);
          //console.log(r);
          if (!Object.keys(obj_result).length == 0) {
            let obj_result1 = {};
            obj_result1["scanned_address"] = val.scanned_address;
            obj_result1["latitude"] = val.latitude;
            obj_result1["longitude"] = val.longitude;
            obj_result1["scan_image"] = val.scan_image;
            finaldata.push({ ...obj_result, ...r, ...obj_result1 });
          }
        })
      );

      const filtered = finaldata.filter((e) => Object.keys(e).length);
      return filtered;
    }

    let userToken = processvehicle_attendance(1);

    userToken.then(function (result) {
      //  console.log(result) // "Some User token"
      dates_search.forEach((da, dind) => {
        array_table.push(da);
      });

      array_table.push("Address");
      array_table.push("Latitude");
      array_table.push("Longitude");
      array_table.push("Image");
      console.log("not admin");
      res
        .status(200)
        .send({ success: true, data: { result: result, table: array_table } });
    });
  }
};
