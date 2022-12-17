const operations = require("../../model/operations");
const multer = require("multer");
const zone = require("../../model/zones");
const circle = require("../../model/circles");
const wards = require("../../model/wards");
const landmark = require("../../model/landmarks");
const area = require("../../model/area");
const complex_building = require("../../model/complex_building");
const complex_build_two = require("../../model/complex_build2");
const communityhall = require("../../model/communityhall");
const streetvendors = require("../../model/streetvendor");
const parking = require("../../model/parking");
const residential_house = require("../../model/residential_house");
const open_place = require("../../model/openplace");
const man_hole_tree_busstops = require("../../model/man_hole_tree_busstop");
const temples = require("../../model/temple");
const TempleOperations = require("../../model/temple_operations");
const StreetVendorOperations = require("../../model/streatVendor_operation");
const manhole_operations = require("../../model/manhole_operations");
const Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
const complexBuilding_operation = require("../../model/complexBuilding_operation");
const communityHall_operation = require("../../model/communityHall_operation");
exports.createoperations = async (req, res) => {
  const {
    user_id,
    collection_id,
    wt_type,
    db_type,
    picked_denied,
    approx_weight,
    reason
  } = req.body;
  var result;
  if (db_type == "comercial_buildings") {
    result = await complex_building.findOne({ _id: collection_id });
  }
  if (db_type == "comercial_flats") {
    var cf = await complex_build_two.findOne({ _id: collection_id });
    result = await complex_building.findOne({ _id: cf.complex_id });
  }
  if (db_type == "communityhalls") {
    result = await communityhall.findOne({ _id: collection_id });
  }
  if (db_type == "streetvendors") {
    result = await streetvendors.findOne({ _id: collection_id });
  }
  if (db_type == "parkings") {
    result = await parking.findOne({ _id: collection_id });
  }
  if (db_type == "residential_houses") {
    result = await residential_house.findOne({ _id: collection_id });
  }
  if (db_type == "open_places") {
    result = await open_place.findOne({ _id: collection_id });
  }
  if (db_type == "man_hole_tree_busstops") {
    result = await man_hole_tree_busstops.findOne({ _id: collection_id });
  }
  if (db_type == "temples") {
    result = await temples.findOne({ _id: collection_id });
  }
  console.log(result);
  const zonerow = await zone
    .findOne({ _id: result.zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();

  const circlerow = await circle
    .findOne({ _id: result.circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();

  const wardrow = await wards
    .findOne(
      { _id: result.ward_id },
      { _id: 1, name: 1, tenent_id: 1, wards_no: 1 }
    )
    .exec();

  const landmarkrow = await landmark
    .findOne(
      { _id: result.landmark_id },
      { _id: 1, landmark_from: 1, landmark_to: 1 }
    )
    .exec();

  const arearow = await area
    .findOne({ _id: result.area_id }, { _id: 1, name: 1 })
    .exec();

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

  var productPictures = [];
  console.log(req.files);
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.path };
    });
  }

  if (picked_denied == 1) {
    if (!wt_type || wt_type == "") {
      return res.status(400).json({
        success: false,
        login: true,
        message: "Weight type field is required"
      });
    }
    if (!approx_weight) {
      return res.status(400).json({
        success: false,
        login: true,
        message: "Approx weight field is required"
      });
    }
    if (req.files.length == 0) {
      return res.status(400).json({
        success: false,
        login: true,
        message: "Image field is required"
      });
    }
  }

  if (picked_denied == 0) {
    if (!reason) {
      return res.status(400).json({
        success: false,
        login: true,
        message: "Reason field is required"
      });
    }
  }
  const list = new operations({
    date: formatted_date,
    zone: zonerow.name,
    circle: circlerow.name,
    ward_name: wardrow.name,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    collection_id: collection_id,
    wt_type: wt_type,
    db_type: db_type,
    picked_denied: picked_denied,
    approx_weight: approx_weight,
    reason: reason,
    tenent_id: zonerow.tenent_id,
    zones_id: result.zones_id,
    circles_id: result.circles_id,
    ward_id: result.ward_id,
    landmark_id: result.landmark_id,
    area_id: result.area_id,
    user_id: user_id,
    image: productPictures
  });

  list.save(async (error, list) => {
    if (error) return res.status(400).json({ error });
    if (list) {
      const structure = {
        time: "",
        wt_type: wt_type,
        picked_denied: picked_denied,
        approx_weight: approx_weight,
        reason: reason,
        image: productPictures,
        user_id: user_id,
        status: "Active",
        created_by: user_id,
        log_date_created: formatted_date,
        log_date_modified: formatted_date,
        attend: "1"
      };
      switch (db_type) {
        case "temples":
          await templesoperations(structure, collection_id);
          break;
        case "streetvendors":
          await streetvendorsoperations(structure, collection_id);
          break;
        case "man_hole_tree_busstops":
          await manholeoperations(structure, collection_id);
          break;
        case "open_places":
          await openPlaceOperation(structure, collection_id);
          break;
        case "parkings":
          await parkingOperation(structure, collection_id);
          break;
        case "comercial_buildings":
          await complexBuildingOperation(structure, collection_id);
          break;
        case "communityhalls":
          await communityHallOperation(structure, collection_id);
          break;
        case "residential_house":
          await residentialHouseOperation(structure, collection_id);
          break;
      }

      res
        .status(200)
        .json({ success: true, login: true, message: "Saved successfully" });
    }
  });
};
async function templesoperations(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;
  const data = await TempleOperations.updateOne(
    { date: formatted_date, temple_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}
async function streetvendorsoperations(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;
  console.log(formatted_date);
  console.log(ObjectId(collection_id));
  const datas = await StreetVendorOperations.findOne(
    { collection_id: ObjectId(collection_id) },
    {}
  ).exec();
  console.log("datas21");
  console.log(datas);
  const data = await StreetVendorOperations.updateOne(
    { date: formatted_date, collection_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      console.log(structure);
      if (err) {
        console.log(err);
      }
    }
  );
}

async function manholeoperations(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;
  const data = await manhole_operations.updateOne(
    { date: formatted_date, manhole_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}

// open place operations update
async function openPlaceOperation(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;

  const data = await openPlace_operation.updateOne(
    { date: formatted_date, manhole_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let current_datetime = new Date();
    let s = new String(current_datetime.getDate());
    let M = new String(current_datetime.getMonth() + 1);
    let cd;
    let mn;
    if (s.length == 1) {
      cd = "0" + s;
    } else {
      cd = current_datetime.getDate();
    }
    if (M.length == 1) {
      mn = "0" + M;
    } else {
      mn = current_datetime.getMonth() + 1;
    }
    let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;

    cb(null, "./uploads/operations/" + formatted_date);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload_operations = multer({ storage: storage });

// parking operations update
async function parkingOperation(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;

  const data = await parking_operation.updateOne(
    { date: formatted_date, manhole_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}
// complexBuilding operations update
async function complexBuildingOperation(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;

  const data = await complexBuilding_operation.updateOne(
    { date: formatted_date, collection_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}
// communityHall operations update
async function communityHallOperation(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;

  const data = await communityHall_operation.updateOne(
    { date: formatted_date, manhole_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}

// residentialHouse operations update
async function residentialHouseOperation(structure, collection_id) {
  let current_datetime = new Date();
  let s = new String(current_datetime.getDate());
  let M = new String(current_datetime.getMonth() + 1);
  let cd;
  let mn;
  if (s.length == 1) {
    cd = "0" + s;
  } else {
    cd = current_datetime.getDate();
  }
  if (M.length == 1) {
    mn = "0" + M;
  } else {
    mn = current_datetime.getMonth() + 1;
  }
  let formatted_date = current_datetime.getFullYear() + "-" + mn + "-" + cd;

  const data = await residentialHouse_operation.updateOne(
    { date: formatted_date, collection_id: collection_id },
    structure,
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      }
    }
  );
}
