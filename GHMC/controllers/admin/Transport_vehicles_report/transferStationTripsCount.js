const Vehicles_attendance = require("../../../model/vehicles_attandance");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const Vehicles = require("../../../model/vehicles");
const Useraccess = require("../../../model/useraccess");
const Zones = require("../../../model/zones");
const Circles = require("../../../model/circles");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var TransferStation = require("../../../model/transferstation");
const landmarks = require("../../../model/landmarks");

exports.transferStationTripCount = async (req, res) => {
  let documents = [];
  let i = 0;

  const {
    user_id,
    zones_id,
    circles_id,
    ward_id,
    areas_id,
    tenent_id,
    status,
    date1,
    date2
  } = req.body;
  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { department_id: 1, user_access_id: 1 }
  ).exec();

  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  let newobject = {};
  let issueObject = {};
  var dates = [];
  var type = "";
  var circles = [];
  var head = [];

  newobject.tenent_id = tenent_id;
  issueObject.tenent_id = tenent_id;

  head.push(
    "zone",
    "circle",
    "ward",
    "area",
    "landmark",
    "type",
    "name",
    "address"
  );

  if (date2 != date1) {
    dates = await getDateRange(new Date(date1), new Date(date2));
    await Promise.all(
      dates.map(async (da, l) => {
        const datse = new Date(da)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "")
          .substr(0, 10);
        head.push(datse);
      })
    );
  } else {
    head.push("date", "image", "TripsCount", "weight");
  }

  if (zones_id != "" && zones_id != undefined && zones_id != "All") {
    newobject["zones_id"] = ObjectId(zones_id);
    issueObject["zones_id"] = ObjectId(zones_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      var zones = access_data["zones"].map((val) => {
        return ObjectId(val);
      });
      newobject.zones_id = { $in: zones };
      issueObject.zones_id = { $in: zones };
    }
  }

  if (circles_id != "" && circles_id != undefined && circles_id != "All") {
    newobject["circles_id"] = ObjectId(circles_id);
    issueObject["circles_id"] = ObjectId(circles_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      access_data["circles"].forEach(function (item) {
        circles.push(ObjectId(item));
      });
      newobject.circles_id = { $in: circles };
      issueObject.circles_id = { $in: circles };
    }
  }

  if (ward_id != "" && ward_id != undefined && ward_id != "All") {
    newobject["ward_id"] = ObjectId(ward_id);
    issueObject["ward_id"] = ObjectId(ward_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      var ward = access_data["ward"].map((val) => {
        return ObjectId(val);
      });
      newobject.ward_id = { $in: ward };
      issueObject.ward_id = { $in: ward };
    }
  }

  if (areas_id != "" && areas_id != undefined && areas_id != "All") {
    newobject["area_id"] = ObjectId(areas_id);
    issueObject["area_id"] = ObjectId(areas_id);
  } else {
    if (role_data.name != "Admin") {
      const access_data = await Useraccess.findOne({
        _id: acc_dep_data.user_access_id
      }).exec();
      var areas = access_data["areas"].map((val) => {
        return ObjectId(val);
      });
      newobject.area_id = { $in: areas };
      issueObject.area_id = { $in: areas };
    }
  }

  let userToken = "";
  if (date1 == date2) {
    type = "today";
  } else {
    type = "days";
  }

  userToken = await alldata(issueObject, date1, date2, dates);
  res.status(200).send({
    login: true,
    status: true,
    result: userToken,
    type: type,
    headers: head
  });
};

async function alldata(issueObject, date1, date2, dates) {
  if (role_data.name == "Admin") {
    if (tenent_id == "" || tenent_id == undefined) {
      return res.status(400).send({
        login: true,
        success: false,
        message: "Tenent id is required"
      });
    }

    let vehicles = await Vehicles.find({
      issueObject,
      vehicle_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] }
    });
    // console.log(vehicles)

    await Promise.all(
      vehicles.map(async (item) => {
        // console.log(item.zone);

        let tdata = await TransferStation.findOne({
          vechile_type: { $in: ["GHMC Swatch Auto", "Private Swatch Auto"] },
          data: formatted_date
        });

        let land = await landmarks.findOne(
          {
            _id: item.landmark_id
          },
          { _id: 1, landmark_from: 1 }
        );

        // console.log(land);

        documents[i] = {};
        documents[i].zone_name = item.zone;
        documents[i].circleName = item.circle;
        documents[i].ward_name = item.ward_name;
        // documents[i].landmark = land.landmark_from;
        documents[i].sfaName = item.incharge;
        documents[i].vehicle_registration_number =
          item.vehicle_registration_number;
        documents[i].owner_type = item.owner_type;
        documents[i].vehicle_type = item.vehicle_type;
        documents[i].driverName = item.driver_name;
        documents[i].driverContact = item.driver_number;

        if (tdata.wastage_weight > 0) {
          documents[i].dateTime = tdata.log_date_created;
          documents[i].TripsCount = 1;
          documents[i].Weight = tdata.wastage_weight;
        } else {
          documents[i].dateTime = "";
          documents[i].TripsCount = 0;
          documents[i].Weight = "0";
        }

        i++;
      })
    );
  }
}
