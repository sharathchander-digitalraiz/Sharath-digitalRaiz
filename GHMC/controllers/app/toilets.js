const toilets = require("../../model/toilets");
const unique_nos = require("../../model/unique_nos");
const multer = require("multer");
const zone = require("../../model/zones");
const circle = require("../../model/circles");
const wards = require("../../model/wards");
const landmark = require("../../model/landmarks");
const area = require("../../model/area");
const Str = require("@supercharge/strings");
const QRCode = require("qrcode");

var fs = require("fs");
const mkdirp = require("mkdirp");
const { createCanvas, loadImage, registerFont } = require("canvas");
const toilets_operations = require("../../model/toilets_operations");
const Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
const Useraccess = require("../../model/useraccess");
const User = require("../../model/users");
const Department = require("../../model/department");

exports.createtoilets = async (req, res) => {
  console.log(req.body);
  const {
    zones_id,
    circles_id,
    ward_id,
    landmark_id,
    area_id,
    user_id,
    address,
    toilet_name,
    incharge_name,
    incharge_mobile,
    existing_disposal,
    quality_of_waste,
    wastage_quantity,
    latitude,
    longitude,
    property_no
  } = req.body;

  const zonerow = await zone
    .findOne({ _id: zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  //  console.log(zonerow);
  const circlerow = await circle
    .findOne({ _id: circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  //  console.log(circlerow);
  const wardrow = await wards
    .findOne({ _id: ward_id }, { _id: 1, name: 1, tenent_id: 1, wards_no: 1 })
    .exec();
  //  console.log(wardrow);
  const landmarkrow = await landmark
    .findOne({ _id: landmark_id }, { _id: 1, landmark_from: 1, landmark_to: 1 })
    .exec();
  //  console.log(landmarkrow);
  const arearow = await area
    .findOne({ _id: area_id }, { _id: 1, name: 1 })
    .exec();
  //  console.log(arearow);
  let productPictures = [];
  if (req.files.length == 0) {
    return res
      .status(400)
      .json({ success: true, login: true, message: "Please upload images" });
  }
  // console.log(req.files);
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const qr_code_image_path = "uploads/qr-images/toilets/qr_codes/";
  var template_image_path = "uploads/qr-images/toilets/templates/";

  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = await module.exports.generate();
  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./Toilets.jpg").then((image) => {
        context.drawImage(image, 0, 0, 1152, 1920);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + circles + "/" + unique_no + ".png",
          buffer
        );
        context.drawImage(image, 0, 0);
      });
      const width = 698;
      const height = 1280;
      registerFont("./fonts/Cambria.ttf", { family: "Cambria" });
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(
        template_image_path + circles + "/" + unique_no + ".png",
        buffer
      );
      const qr_codes = qr_code_image_path + circles + "/" + unique_no + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(toilet_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(address, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(incharge_name, 435, 915);
        //  //location
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(landmarkrow.landmark_from, 435, 968);
        //  //ward
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(arearow.name, 435, 1018);
        //  //circle
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(wardrow.name, 435, 1068);
        //  //zone
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(circlerow.name, 435, 1118);

        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(zonerow.name, 435, 1168);

        context.drawImage(image, 155, 330, 380, 380);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + circles + "/" + unique_no + ".png",
          buffer
        );
        context.drawImage(image, 0, 0);
      });
    }
  );

  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based

  var curr_year = d.getFullYear();
  if (curr_month > 10) {
    curr_month = curr_month;
  } else {
    curr_month = "0" + curr_month;
  }
  var dates = curr_year + "-" + curr_month + "-" + curr_date;

  const place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(latitude);
  place.coordinates.push(longitude);

  const list = new toilets({
    user_id: user_id,
    date: dates,
    zone: zonerow.name,
    circle: circlerow.name,
    ward_name: wardrow.name,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    address: address,
    toilet_name: toilet_name,
    incharge_name: incharge_name,
    incharge_mobile: incharge_mobile,
    existing_disposal: existing_disposal,
    quality_of_waste: quality_of_waste,
    tenent_id: zonerow.tenent_id,
    zones_id: zones_id,
    circles_id: circles_id,
    property_no: property_no,
    ward_id: ward_id,
    landmark_id: landmark_id,
    area_id: area_id,
    place: place,
    image: productPictures,
    wastage_quantity: wastage_quantity,
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png"
  });
  const unique_noss = new unique_nos({
    unique_no: unique_no,
    user_id: user_id,
    type_db: "toilets"
  });

  list.save((error, list) => {
    if (error) return res.status(404).json({ error });
    if (list) {
      unique_noss.save();
      return res
        .status(200)
        .json({ success: true, login: true, message: "Saved successfully" });
    }
  });
};

exports.generate = async (req, res) => {
  const string = Str.random(25);
  const checkstring = await toilets
    .findOne({ unique_no: string }, { _id: 1 })
    .countDocuments();
  if (checkstring == 0) {
    return string;
  } else {
    module.exports.generate();
  }
};

exports.getalltoilets = async (req, res) => {
  const alldata = await toilets.find({ status: "Active" }).exec();
  return res.status(200).json({ status: true, data: alldata });
};

exports.edittoilets = async (req, res) => {
  const id = req.body.id;
  await toilets.findOne({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Open place data not exists" });
    } else {
      return res.status(200).json({ status: true, data });
    }
  });
};

exports.updatetoilets = async (req, res) => {
  const id = req.body.id;
  const {
    zones_id,
    circles_id,
    ward_id,
    landmark_id,
    area_id,
    user_id,
    address,
    toilet_name,
    incharge_name,
    incharge_mobile,
    existing_disposal,
    quality_of_waste,
    wastage_quantity,
    latitude,
    longitude,
    property_no
  } = req.body;
  if (!id) {
    return res
      .status(404)
      .json({ status: false, message: "Toilet id is required" });
  }

  const zonerow = await zone
    .findOne({ _id: req.body.zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  const circlerow = await circle
    .findOne({ _id: req.body.circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  const wardrow = await wards
    .findOne(
      { _id: req.body.ward_id },
      { _id: 1, name: 1, tenent_id: 1, wards_no: 1 }
    )
    .exec();
  const landmarkrow = await landmark
    .findOne(
      { _id: req.body.landmark_id },
      { _id: 1, landmark_from: 1, landmark_to: 1 }
    )
    .exec();
  const arearow = await area
    .findOne({ _id: req.body.area_id }, { _id: 1, name: 1 })
    .exec();
  let productPictures = [];
  //console.log(req.files);
  if (req.files.length > 0) {
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }
  } else {
    var compleximg = await toilets.findOne({ _id: id }, { image: 1 }).exec();
    // console.log(compleximg);
    productPictures = compleximg.image;
  }

  const qr_code_image_path = "uploads/qr-images/toilets/qr_codes/";
  var template_image_path = "uploads/qr-images/toilets/templates/";
  const unique_nos = await toilets
    .findOne({ _id: id }, { unique_no: 1 })
    .exec();
  var circles = circlerow.name.replace(" ", "-");
  fs.mkdir(qr_code_image_path + circles, function (err) {});
  fs.mkdir(template_image_path + circles, function (err) {});
  var unique_no = unique_nos.unique_no;
  QRCode.toFile(
    qr_code_image_path + circles + "/" + unique_no + ".png",
    unique_no,
    { version: 10 },
    function (err) {
      loadImage("./Toilets.jpg").then((image) => {
        context.drawImage(image, 0, 0, 1152, 1920);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + circles + "/" + unique_no + ".png",
          buffer
        );
        context.drawImage(image, 0, 0);
      });
      const width = 698;
      const height = 1280;
      registerFont("./fonts/Cambria.ttf", { family: "Cambria" });
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(
        template_image_path + circles + "/" + unique_no + ".png",
        buffer
      );
      const qr_codes = qr_code_image_path + circles + "/" + unique_no + ".png";
      loadImage(qr_codes).then((image) => {
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(toilet_name, 435, 807);

        //  //vehicle type
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(address, 435, 865);
        //vehicle registeration no
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(incharge_name, 435, 915);
        //  //location
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(landmarkrow.landmark_from, 435, 968);
        //  //ward
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(arearow.name, 435, 1018);
        //  //circle
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(wardrow.name, 435, 1068);
        //  //zone
        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(circlerow.name, 435, 1118);

        context.fillStyle = "#000";
        context.font = "28px cambria";
        context.textAlign = "left";
        context.fillText(zonerow.name, 435, 1168);

        context.drawImage(image, 155, 330, 380, 380);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(
          template_image_path + circles + "/" + unique_no + ".png",
          buffer
        );
        context.drawImage(image, 0, 0);
      });
    }
  );

  const place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(req.body.latitude);
  place.coordinates.push(req.body.longitude);
  const updateRecords = {
    ...req.body,
    image: productPictures,
    place: place,
    zones_id: req.body.zones_id,
    circles_id: req.body.circles_id,
    ward_id: req.body.ward_id,
    landmark_id: req.body.landmark_id,
    area_id: req.body.area_id,
    zone: zonerow.name,
    circle_no: circlerow.circle_no,
    circle: circlerow.name,
    wards_no: wardrow.wards_no,
    property_no: property_no,
    ward_name: wardrow.name,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    user_id: req.user.user_id,
    modified_by: req.user.user_id,
    log_date_modified: new Date(),
    unique_no: unique_no,
    qr_image: template_image_path + circles + "/" + unique_no + ".png",
    qr_code_view: template_image_path + circles + "/" + unique_no + ".png"
  };

  await toilets.findByIdAndUpdate(
    { _id: id },
    { ...updateRecords },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update place" });
      } else if (data == null) {
        return res.status(404).json({ status: false, message: "Invalid id" });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Updated Successfully" });
      }
    }
  );
};

exports.deletetoilets = async (req, res) => {
  const _id = req.body.id;
  // console.log(id);
  const updateRecords = {
    status: "In-active"
  };
  await toilets.findByIdAndUpdate(
    { _id },
    { ...updateRecords },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to delete " });
      } else if (data == null) {
        return res
          .status(404)
          .json({ status: false, message: "No records found to delete" });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Deleted Successfully" });
      }
    }
  );
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/toilets/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
exports.uploadtoilets = multer({ storage: storage });

exports.Toiletsscan_cronjob = async (req, res) => {
  const datarows = await toilets.find({}).exec();
  const docs = [];
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
  datarows.forEach(async function (item) {
    var docs = {
      date: formatted_date,
      time: "",
      zone: item.zone,
      circle: item.circle,
      ward_name: item.ward_name,
      area: item.area,
      landmark: item.landmark,
      tenent_id: item.tenent_id,
      zones_id: item.zones_id,
      circles_id: item.circles_id,
      ward_id: item.ward_id,
      landmark_id: item.landmark_id,
      area_id: item.area_id,
      user_id: null,
      address: item.address,
      collection_id: item._id,
      operation_type: null,
      reason_type: null,
      reason_type_description: null,
      wt_type: "",
      picked_denied: "",
      approx_weight: "",
      reason: "",
      image: [],
      status: "Active",
      created_by: null,
      log_date_created: "",
      log_date_modified: "",
      modified_by: null,
      toilet_name: item.toilet_name,
      attend: "0"
    };
    const result = await toilets_operations(docs).save();
  });
  responseObject = {
    success: true,
    login: true,
    message: " Saved successfully"
  };
  res.status(200).json(responseObject);
};

exports.toilets_report_search = async (req, res) => {
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
  console.log(role_data.name);
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
    // dates=datse.sort();
  } else {
    head.push("date", "image", "picked_denied", "weight", "reason");
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

  if (status != "All") {
    issueObject.attend = status;
  }
  console.log(status);
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
  console.log(issueObject);
  const dbData = await toilets_operations
    .find(issueObject)
    .sort({ name: -1 })
    .exec();
  async function processculvert_issue(data) {
    let finaldata = [];
    await Promise.all(
      dbData.map(async (val, i) => {
        console.log(val);
        let obj = {
          zone: val.zone,
          circle: val.circle,
          ward: val.ward_name,
          area: val.area,
          landmark: val.landmark,
          name: val.toilet_name ? val.toilet_name : "-",
          address: val.address ? val.address : "-"
        };
        console.log(obj);
        if (date1 == date2) {
          switch (val.attend) {
            case "0":
              (obj["type"] = val.operation_type ? val.operation_type : "-"),
                (obj["date"] = date2);
              obj["image"] = [];
              obj["picked_denied"] = "-";
              obj["weight"] = "-";
              obj["reason"] = "-";
              break;
            case "1":
              obj["date"] = date2;
              (obj["type"] = val.operation_type ? val.operation_type : "-"),
                (obj["image"] = val.image);
              obj["picked_denied"] = val.picked_denied == "0" ? "Yes" : "No";
              obj["weight"] = val.weight ? val.weight : "-";
              obj["reason"] = val.reason ? val.reason : "-";
              break;
            default:
              obj["date"] = date2;
              (obj["type"] = val.operation_type ? val.operation_type : "-"),
                (obj["image"] = []);
              obj["picked_denied"] = "-";
              obj["weight"] = "-";
              obj["reason"] = "-";
          }
          obj["data"] = [];
        } else {
          obj["data"] = [];
          obj["image"] = [];
          await Promise.all(
            dates.map(async (da, l) => {
              var df = new Date(da)
                .toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, "")
                .substr(0, 10);
              var oj = {
                date: df,
                attend: 0
              };
              var doc = await toilets_operations
                .findOne({ collection_id: val.temple_id, date: df }, {})
                .exec();
              //  console.log(doc);
              if (doc != "" && doc != null) {
                oj.attend = doc.attend;
              } else {
                oj.attend = "-";
              }

              console.log(oj);
              obj["data"].push(oj);
              await obj["data"].sort(compare);
            })
          );
        }

        finaldata.push(obj);
      })
    );
    return finaldata;
  }
  return processculvert_issue(1);
}

function getDateRange(startDate, endDate, addFn, interval) {
  addFn = addFn || Date.prototype.addDays;
  interval = interval || 1;
  var dates = [];
  var date = new Date(startDate);
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

function compare(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}
