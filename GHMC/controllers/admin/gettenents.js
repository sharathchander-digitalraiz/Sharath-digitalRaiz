const Tenents = require("../../model/tenent");
const users = require("../../model/users");
let jwt = require("jsonwebtoken");
const config = require("../../config/configuration");
const user_geoaccess = require("../../model/tenent_geo_tagging_access");
const user_access = require("../../model/useraccess");

exports.gettents = async (req, res) => {
  const alldata = await Tenents.find({}).exec();
  return res.status(200).json({ status: true, data: alldata });
};

exports.edittenents = async (req, res) => {
  const id = req.body.id;
  await Tenents.findOne(
    { _id: id },
    {
      _id: 1,
      name: true,
      city: 1,
      district: 1,
      image: 1,
      state: 1,
      status: 1,
      valueOf
    },
    (err, data) => {
      if (err) {
        return res
          .status(400)
          .json({ status: false, message: "Sorry something went wrong" });
      } else {
        return res.status(200).json({ status: true, data });
      }
    }
  );
};

exports.deletetenents = async (req, res) => {
  const id = req.body.id;
  await Tenents.findByIdAndDelete({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ status: false, message: "Sorry unable to delete Tenents" });
    } else if (data == null) {
      return res
        .status(400)
        .json({ status: false, message: "No records found to delete" });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Deleted Successfully" });
    }
  });
};

exports.updatetenents = async (req, res) => {
  const _id = req.body.id;
  tenetn = await Tenents.findOne({ _id: _id }, { image: 1 }).exec();
  image = "";
  if (req.file) {
    image = req.file.path;
  } else {
    image = tenetn.image;
  }
  console.log(req.file);
  if (_id) {
    const updateRecords = {
      ...req.body,
      modified_by: req.user.user_id,
      image: image,
      log_date_modified: new Date()
    };

    await Tenents.findByIdAndUpdate(
      { _id },
      { ...updateRecords },
      (err, data) => {
        if (err) {
          return res
            .status(400)
            .json({ status: false, message: "Sorry unable to update Tenents" });
        } else if (data == null) {
          return res
            .status(400)
            .json({ status: false, message: "Sorry unable to update Tenents" });
        } else if (data) {
          return res
            .status(200)
            .json({ status: true, message: "Tenents updated successfully" });
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Tenent Id is required" });
  }
};

exports.tenetLogin = async (req, res) => {
  const tenent_id = req.body.tenent_id;
  const user_data = await users
    .findOne({ tenent_id: tenent_id, department_name: "Admin" })
    .exec();
  console.log(user_data);
  let token = jwt.sign(
    { username: user_data.username, user_id: user_data._id },
    config.secret,
    { expiresIn: "24h" }
  );
  let data = {};
  data.user_id = user_data._id;
  data.first_name = user_data.first_name;
  data.last_name = user_data.last_name;
  data.email = user_data.email;
  data.mobile = user_data.mobile_number;
  data.deparment_id = user_data.deparment_id;
  data.department_name = user_data.department_name;
  data.token = token;
  let user_geoaccess_rows = 0;
  let user_geoaccess_data = [];
  let user_acc_data = [];
  if (user_data.department_name == "Admin") {
    user_geoaccess_rows = await user_geoaccess
      .findOne({ _id: user_data.user_geoaccess_id })
      .countDocuments();
    user_geoaccess_data = await user_geoaccess
      .findOne({ _id: user_data.user_geoaccess_id })
      .exec();
    user_acc_data = user_geoaccess_data.geo_tag_access;
    data.tenent_id = user_data.tenent_id;
  } else if (user_data.department_name != "Super Admin") {
    user_geoaccess_rows = await user_access
      .findOne({ _id: user_data.user_access_id })
      .countDocuments();
    user_geoaccess_data = await user_access
      .findOne({ _id: user_data.user_access_id })
      .exec();
    user_acc_data = user_geoaccess_data.admin_access;
    data.tenent_id = user_data.tenent_id;
  }
  console.log(user_geoaccess_rows);
  if (user_geoaccess_rows > 0) {
    data.access = user_acc_data;
  } else {
    data.access = [];
    data.tenent_id = "";
  }
  responseObject = {
    success: true,
    login: true,
    message: "Authentication successful!",
    data: data
  };
  res.status(200).json(responseObject);
};
