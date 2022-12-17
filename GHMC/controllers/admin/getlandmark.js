const Landmarks = require("../../model/landmarks");
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
var ObjectId = Mongoose.Types.ObjectId;

exports.getLandmarks = async (req, res) => {
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
  const showLandmark = await Landmarks.find({
    tenent_id: ObjectId(tenent_id)
  }).exec();

  let documents = [];
  let i = 0;

  await Promise.all(
    showLandmark.map(async (d) => {
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

      const showArea = await areaModel.findOne(
        { $or: [{ _id: d.area_id }, { _id: d.areas_id }] },
        { _id: 0, name: 1 }
      );

      documents[i] = {};
      documents[i]._id = d._id;
      documents[i].zone_no = showZone ? showZone.zone_no : "-";
      documents[i].zone_name = showZone ? showZone.name : "";
      documents[i].circle_no = showCircle ? showCircle.circle_no : "-";
      documents[i].circle_name = showCircle ? showCircle.name : "";
      documents[i].wards_no = showWard ? showWard.wards_no : "-";
      documents[i].ward_name = showWard ? showWard.name : "";
      documents[i].area_name = showArea ? showArea.name : "";
      documents[i].landmark_no = d.landmark_no;
      documents[i].landmark_from = d.landmark_from;
      documents[i].landmark_to = d.landmark_to;
      documents[i].tenent_id = d.tenent_id;
      documents[i].tenent = tenet.name;
      documents[i].created_id = d.created_by;
      documents[i].created = uzer ? uzer.last_name : "";

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

  const showLandmark = await Landmarks.find({
    zones_id: { $in: acc_zones }
  }).exec();

  //   console.log(showCircle);
  await Promise.all(
    showLandmark.map(async (d) => {
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

      const showArea = await areaModel.findOne(
        { $or: [{ _id: d.area_id }, { _id: d.areas_id }] },
        { _id: 0, name: 1 }
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
      documents[i].area_name = showArea ? showArea.name : "";
      documents[i].landmark_no = d.landmark_no;
      documents[i].landmark_from = d.landmark_from;
      documents[i].landmark_to = d.landmark_to;
      documents[i].tenent_id = d.tenent_id;
      documents[i].tenent = tenet ? tenet.name : "";
      documents[i].created_id = d.created_by;
      documents[i].created = uzer ? uzer.last_name : "";

      // console.log(zoneDetails);
      i++;
      // console.log(documents);
    })

    //   console.log(documents);
  );
  return documents;
}

exports.getareawiselandmark = async (req, res) => {
  const a_id = req.body.area_id;

  let allarealand = await Landmarks.aggregate([
    {
      $match: { area_id: { $in: [ObjectId(a_id)] } }
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: { $concat: ["$landmark_from", " - ", "$landmark_to"] }
      }
    }
  ]);
  return res.status(200).json({ status: true, login: true, data: allarealand });
};

exports.admin_getareawiselandmark = async (req, res) => {
  const a_id = req.body.area_id;
  const docs = [];
  await Promise.all(
    a_id.map(async (element, dind) => {
      docs.push(ObjectId(element));
    })
  );
  console.log(a_id);
  const allarealand = await Landmarks.find(
    { area_id: { $in: docs } },
    { _id: 1, landmark_from: 1, landmark_to: 1 }
  ).exec();
  return res.status(200).json({ status: true, data: allarealand });
};

exports.getwardwiselandmark = async (req, res) => {
  const w_id = req.body.wards_id;
  const allwardland = await Landmarks.find(
    { wards_id: { $in: w_id } },
    { _id: 1, landmark_from: 1 }
  );
  return res.status(200).json({ status: true, data: allwardland });
};

exports.deletelandmark = async (req, res) => {
  id = req.body.id;
  //  console.log(id);
  await Landmarks.findByIdAndDelete({ _id: id }, (err, data) => {
    //  console.log(data);
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Sorry unable to delete landmark" });
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

exports.editlandmarks = async (req, res) => {
  const id = req.body.id;
  await Landmarks.findOne(
    { _id: id },
    {
      _id: 1,
      landmark_no: true,
      landmark_from: true,
      landmark_to: true,
      tenent_id: true,
      zones_id: true,
      circles_id: true,
      areas_id: true,
      wards_id: true,
      status: 1
    },
    async (err, landData) => {
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Ward data not exists" });
      } else {
        const showTenent = await tenent.find(
          { _id: landData.tenent_id },
          { _id: 1, name: 1 }
        );
        const showZone = await zoneModel.find(
          { _id: landData.zones_id },
          { _id: 1, name: 1 }
        );
        const showCircle = await circleModel.find(
          { _id: landData.circles_id },
          { _id: 1, name: 1 }
        );
        const showArea = await areaModel.find(
          { $or: [{ _id: landData.area_id }, { _id: landData.areas_id }] },
          { _id: 1, name: 1 }
        );
        const showWard = await wardModel.find(
          { _id: landData.wards_id },
          { _id: 1, name: 1 }
        );

        let datalandmark = {};
        datalandmark._id = landData._id;
        datalandmark.landmark_no = landData.landmark_no;
        datalandmark.landmark_from = landData.landmark_from;
        datalandmark.landmark_to = landData.landmark_to;
        datalandmark.tenent_id = landData.tenent_id;
        datalandmark.tenent = showTenent[0].name;
        datalandmark.zones_id = landData.zones_id;
        datalandmark.zone_name = showZone[0].name;
        datalandmark.circles_id = landData.circles_id;
        datalandmark.circle_name = showCircle[0].name;
        datalandmark.wards_id = landData.wards_id;
        datalandmark.ward_name = showWard[0].name;
        datalandmark.area_id = landData.area_id || landData.areas_id;
        datalandmark.area_name = showArea[0].name;
        datalandmark.status = landData.status;

        return res.status(200).json({ status: true, data: datalandmark });
      }
    }
  );
};

exports.updatelandmark = async (req, res) => {
  console.log(req.userId);
  const {
    id,
    zones_id,
    circles_id,
    wards_id,
    areas_id,
    area_id,
    landmark_no,
    landmark_from,
    landmark_to,
    tenent_id,
    created_by,
    status
  } = req.body;
  // console.log(updateRecords);
  const changeLandmark = await Landmarks.updateOne(
    { _id: id },
    {
      zones_id: zones_id,
      circles_id: circles_id,
      wards_id: wards_id,
      area_id: areas_id || area_id,
      landmark_no: landmark_no,
      landmark_from: landmark_from,
      landmark_to: landmark_to,
      tenent_id: tenent_id,
      created_by: created_by,
      modified_by: req.userId,
      status: status
    },
    { new: true }
  );

  if (changeLandmark) {
    return res
      .status(200)
      .json({ status: true, message: "Landmark updated successfully" });
  }

  /******
  (err, data) => {
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update landmark" });
      } else if (data == null) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update landmark" });
      } else if (data) {
        return res
          .status(404)
          .json({ status: false, message: "Landmark updated successfully" });
      }
    } 
  *******/
};
