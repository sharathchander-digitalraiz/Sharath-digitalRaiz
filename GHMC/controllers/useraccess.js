const useraccess = require("../model/useraccess");
const accesscategory = require("../model/accesscategory");
const geotagtype = require("../model/geotagtype");
const users = require("../model/users");

exports.createuseraccess = async (req, res) => {
  console.log(req.body.appaccess);
  const {
    name,
    tenent_id,
    status,
    log_date_created,
    geo_tag_id,
    app_access_ids,
    zones,
    circles,
    ward,
    landmarks,
    areas,
    appaccess,
    admin_access
  } = req.body;

  let geo_tag_ida = geo_tag_id;
  let app_access_ida = app_access_ids;
  let zone = zones;
  let circle = circles;
  let wards = ward;
  let landmark = landmarks;
  let area = areas;
  if (geo_tag_ida.length == 0) {
    geo_tag_ida = [];
  }
  // if(app_access_ida.length == 0)
  // {
  //      app_access_ida = [];
  // }
  if (zone.length == 0) {
    zone = [];
  }
  if (circle.length == 0) {
    circle = [];
  }
  if (wards.length == 0) {
    wards = [];
  }
  if (landmark.length == 0) {
    landmark = [];
  }
  if (areas.length == 0) {
    area = [];
  }

  let app_access = {};
  await Promise.all(
    appaccess.map(async (note) => {
      app_access[note.type] = note.value;
    })
  );

  const list = new useraccess({
    name: name,
    tenent_id: tenent_id,
    zones: zone,
    circles: circle,
    ward: wards,
    areas: area,
    landmarks: landmark,
    app_access_ids: [],
    geo_tag_id: geo_tag_ida,
    appaccess: app_access,
    status: status,
    log_date_created: log_date_created,
    admin_access: admin_access
  });

  list.save((error, list) => {
    if (error) return res.status(400).json({ error });
    if (list) {
      res.status(200).json({ status: true, message: "Added Successfully" });
    }
  });
};

exports.updateuseraccess = async (req, res) => {
  const {
    name,
    tenent_id,
    status,
    log_date_created,
    geo_tag_id,
    app_access_ids,
    zones,
    circles,
    ward,
    landmarks,
    areas,
    appaccess,
    admin_access,
    _id
  } = req.body;

  let geo_tag_ida = geo_tag_id;
  let app_access_ida = app_access_ids;
  let zone = zones;
  let circle = circles;
  let wards = ward;
  let landmark = landmarks;
  let area = areas;
  if (geo_tag_ida.length == 0) {
    geo_tag_ida = [];
  }
  // if(app_access_ida.length == 0)
  // {
  //      app_access_ida = [];
  // }
  if (zone.length == 0) {
    zone = [];
  }
  if (circle.length == 0) {
    circle = [];
  }
  if (wards.length == 0) {
    wards = [];
  }
  if (landmark.length == 0) {
    landmark = [];
  }
  if (areas.length == 0) {
    area = [];
  }

  let app_access = {};
  await Promise.all(
    appaccess.map(async (note) => {
      app_access[note.type] = note.value;
    })
  );

  let updateRecords = {
    name: name,
    tenent_id: tenent_id,
    zones: zone,
    circles: circle,
    ward: wards,
    areas: area,
    landmarks: landmark,
    app_access_ids: [],
    geo_tag_id: geo_tag_ida,
    appaccess: app_access,
    status: status,
    log_date_created: log_date_created,
    admin_access: admin_access
  };

  await useraccess.findByIdAndUpdate(
    { _id },
    { ...updateRecords },
    (err, data) => {
      if (err) {
        return res
          .status(400)
          .json({
            status: false,
            login: true,
            message: "Not Updated.Try again"
          });
      } else if (data == null) {
        return res
          .status(400)
          .json({
            status: false,
            login: true,
            message: "Not Updated.Try again"
          });
      } else if (data) {
        return res
          .status(200)
          .json({
            status: false,
            login: true,
            message: "Updated successfully"
          });
      }
    }
  );
};

exports.geotagaccess = async (req, res) => {
  let geoaccess = await geotagtype.find({ status: "Active" }).exec();
  res.status(200).json({ status: "true", message: "success", data: geoaccess });
};

exports.mobileappaccess = async (req, res) => {
  let mobileappaccess = await accesscategory
    .find({ status: "Active" }, { _id: true, name: true, key_type: true })
    .exec();
  res
    .status(200)
    .json({ status: "true", message: "success", data: mobileappaccess });
};
