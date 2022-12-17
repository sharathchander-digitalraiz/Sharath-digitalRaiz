const Areas = require("../../model/area");
const mongoose = require("mongoose");
var Mongoose = require("mongoose");
const wardModel = require("../../model/wards");
const circleModel = require("../../model/circles");
const zoneModel = require("../../model/zones");
const areaModel = require("../../model/area");
const tenent = require("../../model/tenent");
const userModel = require("../../model/users");
const departmentModel = require("../../model/department");
const useraccessModel = require("../../model/useraccess");
var ObjectId = mongoose.Types.ObjectId;

exports.getallarea = async (req, res) => {
  //   try {
  const { user_id, tenent_id } = req.body;

  let acc_dep_data = await userModel
    .findOne({ _id: user_id }, { department_id: 1, user_access_id: 1 })
    .exec();

  let role_data = await departmentModel.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  let documents = [];

  switch (role_data.name) {
    case "Admin":
      documents = await admindata(tenent_id);
      break;
    default:
      documents = await userdata(acc_dep_data);
      break;
  }

  res.status(200).json({ status: true, message: "Success", data: documents });
  //   } catch (err) {
  //     res.status(400).json({ message: "Bad request" });
  //   }
};

async function admindata(tenent_id) {
  const showArea = await areaModel
    .find({ tenent_id: ObjectId(tenent_id) })
    .exec();

  let documents = [];
  let i = 0;

  await Promise.all(
    showArea.map(async (d) => {
      const tenet = await tenent.findOne(
        { _id: d.tenent_id },
        { _id: 1, name: 1 }
      );

      const uzer = await userModel.findOne(
        { _id: d.created_by },
        { _id: 1, last_name: 1 }
      );

      const showZone = await zoneModel.findOne(
        { _id: d.zones_id },
        { _id: 0, zone_no: 1, name: 1 }
      );

      const showCircle = await circleModel.findOne(
        { _id: d.circles_id },
        { _id: 0, circle_no: 1, name: 1 }
      );

      const showWard = await wardModel.findOne(
        { _id: d.wards_id },
        { _id: 0, wards_no: 1, name: 1 }
      );

      documents[i] = {};
      documents[i]._id = d._id;
      documents[i].zone_no = showZone ? showZone.zone_no : "-";
      documents[i].zone_name = showZone ? showZone.name : "";
      documents[i].circle_no = showCircle ? showCircle.circle_no : "-";
      documents[i].circle_name = showCircle ? showCircle.name : "";
      documents[i].wards_no = showWard ? showWard.wards_no : "-";
      documents[i].ward_name = showWard ? showWard.name : "";
      documents[i].name = d.name;
      documents[i].tenent_id = d.tenent_id;
      documents[i].tenent = tenet.name;
      documents[i].created_id = d.created_by;
      documents[i].created = uzer.last_name;

      i++;
    })
  );
  return documents;
}

async function userdata(acc_dep_data) {
  const access_data = await useraccessModel
    .findOne({
      _id: acc_dep_data.user_access_id
    })
    .exec();
  let acc_zones = [];
  let documents = [];
  let i = 0;

  acc_zones = access_data["zones"].map((val) => {
    return ObjectId(val);
  });
  //   console.log(acc_zones);

  const showArea = await areaModel
    .find({ zones_id: { $in: acc_zones } })
    .exec();

  //   console.log(showCircle);
  await Promise.all(
    showArea.map(async (d) => {
      const tenet = await tenent.findOne(
        { _id: d.tenent_id },
        { _id: 1, name: 1 }
      );

      const uzer = await userModel.findOne(
        { _id: d.created_by },
        { _id: 1, last_name: 1 }
      );

      const showZone = await zoneModel.findOne(
        { _id: d.zones_id },
        { _id: 0, zone_no: 1, name: 1 }
      );

      const showCircle = await circleModel.findOne(
        { _id: d.circles_id },
        { _id: 0, circle_no: 1, name: 1 }
      );

      const showWard = await wardModel.findOne(
        { _id: d.wards_id },
        { _id: 0, wards_no: 1, name: 1 }
      );

      // console.log(tenet);

      documents[i] = {};
      documents[i]._id = d._id;
      documents[i].zone_no = showZone ? showZone.zone_no : "-";
      documents[i].zone_name = showZone ? showZone.name : "";
      documents[i].circle_no = showCircle ? showCircle.circle_no : "-";
      documents[i].circle_name = showCircle ? showCircle.name : "";
      documents[i].wards_no = showWard ? showWard.wards_no : "-";
      documents[i].ward_name = showWard ? showWard.name : "";
      documents[i].name = d.name;
      documents[i].tenent_id = d.tenent_id;
      documents[i].tenent = tenet.name;
      documents[i].created_id = d.created_by;
      documents[i].created = uzer.last_name;

      // console.log(zoneDetails);
      i++;
      // console.log(documents);
    })

    //   console.log(documents);
  );
  return documents;
}

exports.editarea = async (req, res) => {
  const id = req.body.id;
  await Areas.findOne(
    { _id: id },
    {
      _id: 1,
      name: true,
      tenent_id: true,
      zones_id: true,
      circles_id: true,
      wards_id: true,
      status: 1
    },
    async (err, areadata) => {
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Ward data not exists" });
      } else {
        const showZone = await zoneModel.find(
          { _id: areadata.zones_id },
          { _id: 1, name: 1 }
        );
        const showCircle = await circleModel.find(
          { _id: areadata.circles_id },
          { _id: 1, name: 1 }
        );
        const showWard = await wardModel.find(
          { _id: areadata.wards_id },
          { _id: 1, name: 1 }
        );

        let areaDetail = {};
        areaDetail._id = areadata._id;
        areaDetail.name = areadata.name;
        areaDetail.tenent_id = areadata.tenent_id;
        areaDetail.zones_id = areadata.zones_id;
        areaDetail.zone_name = showZone[0].name;
        areaDetail.circles_id = areadata.circles_id;
        areaDetail.circle_name = showCircle[0].name;
        areaDetail.wards_id = areadata.wards_id;
        areaDetail.ward_name = showWard[0].name;
        areaDetail.status = areadata.status;

        return res.status(200).json({ status: true, data: areaDetail });
      }
    }
  );
};

exports.deletearea = async (req, res) => {
  id = req.body.id;

  await Areas.findByIdAndDelete({ _id: id }, (err, data) => {
    //  console.log(data);
    if (err) {
      return res.status(400).json({
        status: false,
        login: true,
        message: "Sorry unable to delete area"
      });
    } else if (data == null) {
      return res.status(400).json({
        status: false,
        login: true,
        message: "No records found to delete"
      });
    } else {
      return res
        .status(200)
        .json({ status: true, login: true, message: "Deleted Successfully" });
    }
  });
};

exports.updatearea = async (req, res) => {
  const _id = req.body.id;
  const updateRecords = {
    ...req.body,
    modified_by: req.user.user_id,
    log_date_modified: new Date()
  };

  await Areas.findByIdAndUpdate({ _id }, { ...updateRecords }, (err, data) => {
    if (err) {
      return res.status(400).json({
        status: false,
        login: true,
        message: "Sorry unable to update area"
      });
    } else if (data == null) {
      return res.status(400).json({
        status: false,
        login: true,
        message: "Sorry unable to update area"
      });
    } else if (data) {
      return res.status(200).json({
        status: false,
        login: true,
        message: "Area updated successfully"
      });
    }
  });
};

exports.getallareas = async (req, res) => {
  const allarea = await Areas.find({}, { _id: 1, name: 1 }).exec();
  return res.status(404).json({ status: true, data: allarea });
};

exports.getwardwisearea = async (req, res) => {
  const w_id = req.body.wards_id;
  console.log(w_id);
  const allwardarea = await Areas.find(
    { wards_id: { $in: w_id } },
    { _id: 1, name: 1 }
  );
  return res.status(200).json({ status: true, data: allwardarea });
};

exports.createarea = (req, res) => {
  const {
    name,
    tenent_id,
    zones_id,
    circles_id,
    wards_id,
    status,
    created_by
  } = req.body;
  console.log(req.body);
  const save_area = new Areas({
    name: name,
    tenent_id: tenent_id,
    zones_id: zones_id,
    status: status,
    circles_id: circles_id,
    wards_id: wards_id,
    log_date_modified: null,
    created_by: created_by,
    modified_by: null
  });

  save_area.save((error, landmark) => {
    if (error)
      return res
        .status(400)
        .json({ success: false, login: true, message: error });
    if (landmark) {
      return res
        .status(200)
        .json({ success: true, login: true, message: "Saved Successfully" });
    }
  });
};
