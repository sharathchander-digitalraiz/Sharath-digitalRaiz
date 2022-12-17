const gvpbep = require("../../model/gvpbep");
const zones = require("../../model/zones");
const wards = require("../../model/wards");
const user = require("../../model/users");
const circles = require("../../model/circles");
const landmarks = require("../../model/landmarks");
const areas = require("../../model/area");
const useraccess = require("../../model/useraccess");

exports.add_admin_gvp_bep = async (req, res) => {
  const {
    user_id,
    type,
    longitude,
    lattitude,
    area,
    landmark,
    ward,
    circle,
    zone,
    location
  } = req.body;
  const zonerow = await zones
    .findOne({ _id: zone }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  const circlerow = await circles
    .findOne({ _id: circle }, { _id: 1, name: 1 })
    .exec();
  const wardsrow = await wards
    .findOne({ _id: ward }, { _id: 1, name: 1, ward_no: 1 })
    .exec();
  const usersrow = await user
    .findOne(
      { _id: user_id },
      {
        _id: 1,
        first_name: 1,
        last_name: 1,
        department_name: 1,
        mobile_number: 1
      }
    )
    .exec();
  const landmarkrow = await landmarks
    .findOne({ _id: landmark }, { _id: 1, landmark_from: 1, landmark_to: 1 })
    .exec();
  const arearow = await areas
    .findOne({ _id: area }, { _id: 1, name: 1 })
    .exec();

  const place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(lattitude);
  place.coordinates.push(longitude);

  const save_gvpbeps = new gvpbep({
    zone: zonerow.name,
    circle: circlerow.name,
    ward_no: wardsrow.ward_no,
    ward_name: wardsrow.name,
    incharge: usersrow.first_name + "-" + usersrow.last_name,
    designation: usersrow.department_name,
    mobile_number: usersrow.mobile_number,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    location: location,
    zone_id: zone,
    circle_id: circle,
    ward_id: ward,
    area_id: area,
    landmark_id: landmark,
    created_by: user_id,
    modified_by: null,
    type: type,
    status: "Active",
    place: place
  });
  save_gvpbeps.save((error, user) => {
    if (error)
      return res
        .status(400)
        .json({ success: false, login: true, message: error });
    if (user) {
      responseObject = {
        success: true,
        login: true,
        message: "Saved successfully"
      };
      res.status(200).json(responseObject);
    }
  });
};

exports.getalladmingvpbep = async (req, res) => {
  const allgvpbep = await gvpbep
    .find(
      { status: "Active" },
      {
        user_id: 0,
        created_by: 0,
        modified_by: 0,
        log_date_created: 0,
        log_date_modified: 0
      }
    )
    .exec();
  return res
    .status(200)
    .json({ status: true, login: true, message: "Success", data: allgvpbep });
};

exports.edit_admingvpbep = async (req, res) => {
  const id = req.body.id;
  await gvpbep.findOne({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Data not exists" });
    } else {
      return res.status(200).json({ status: true, login: true, data });
    }
  });
};

exports.update_admingvpbep = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(404).json({ status: false, message: "Id is required" });
  }
  const zonerow = await zones
    .findOne({ _id: req.body.zone }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  const circlerow = await circles
    .findOne({ _id: req.body.circle }, { _id: 1, name: 1 })
    .exec();
  const wardsrow = await wards
    .findOne({ _id: req.body.ward }, { _id: 1, name: 1, ward_no: 1 })
    .exec();
  const usersrow = await user
    .findOne(
      { _id: req.body.user_id },
      {
        _id: 1,
        first_name: 1,
        last_name: 1,
        department_name: 1,
        mobile_number: 1
      }
    )
    .exec();
  const landmarkrow = await landmarks
    .findOne(
      { _id: req.body.landmark },
      { _id: 1, landmark_from: 1, landmark_to: 1 }
    )
    .exec();
  const arearow = await areas
    .findOne({ _id: req.body.area }, { _id: 1, name: 1 })
    .exec();

  const place = {};
  place.type = "Point";
  place.coordinates = [];
  place.coordinates.push(req.body.lattitude);
  place.coordinates.push(req.body.longitude);

  const updateRecords = {
    ...req.body,
    zone: zonerow.name,
    circle: circlerow.name,
    ward_no: wardsrow.ward_no,
    ward_name: wardsrow.name,
    incharge: usersrow.first_name + "-" + usersrow.last_name,
    designation: usersrow.department_name,
    mobile_number: usersrow.mobile_number,
    area: arearow.name,
    landmark: landmarkrow.landmark_from + "-" + landmarkrow.landmark_to,
    zone_id: req.body.zone,
    circle_id: req.body.circle,
    ward_id: req.body.ward,
    area_id: req.body.area,
    landmark_id: req.body.landmark,
    created_by: req.body.user_id,
    modified_by: req.body.user_id,
    status: "Active",
    place: place
  };
  console.log(updateRecords);
  await gvpbep.findByIdAndUpdate(
    { _id: id },
    { ...updateRecords },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update records" });
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

exports.delete_admingvpbep = async (req, res) => {
  const _id = req.body.id;
  // console.log(id);
  const updateRecords = {
    status: "In-active"
  };
  await gvpbep.findByIdAndUpdate({ _id }, { ...updateRecords }, (err, data) => {
    //  console.log(data);
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Sorry unable to delete" });
    } else if (data == null) {
      return res
        .status(404)
        .json({ status: false, message: "No records found to delete" });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Deleted Successfully" });
    }
  });
};
