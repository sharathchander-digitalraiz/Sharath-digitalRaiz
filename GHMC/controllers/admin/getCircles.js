const Circles = require("../../model/circles");
var mongoose = require("mongoose");
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

exports.getcircles = async (req, res) => {
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
  const showCircle = await circleModel
    .find({ tenent_id: ObjectId(tenent_id) })
    .exec();

  let documents = [];
  let i = 0;

  await Promise.all(
    showCircle.map(async (d) => {
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

      documents[i] = {};
      documents[i]._id = d._id;
      documents[i].zone_no = showZone ? showZone.zone_no : "-";
      documents[i].zone_name = showZone ? showZone.name : "";
      documents[i].circle_no = d.circle_no;
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

  const showCircle = await circleModel
    .find({ zones_id: { $in: acc_zones } })
    .exec();

  //   console.log(showCircle);
  await Promise.all(
    showCircle.map(async (d) => {
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

      // console.log(tenet);

      documents[i] = {};
      documents[i]._id = d._id;
      documents[i].zone_no = showZone ? showZone.zone_no : "-";
      documents[i].zone_name = showZone ? showZone.name : "";
      documents[i].circle_no = d.circle_no;
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

exports.editcircles = async (req, res) => {
  const id = req.body.id;
  const circle_data = await Circles.aggregate([
    { $match: { _id: { $in: [ObjectId(id)] } } },
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
        from: "tenents", // other table name
        localField: "tenent_id", // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "tenent_info" // alias for userinfo table
      }
    }, // define which fields are you want to fetch
    { $unwind: "$tenent_info" },
    {
      $project: {
        _id: 1,
        tenent_name: "$tenent_info.name",
        zone_name: "$zones_info.name",
        circle_name: 1,
        zones_id: 1,
        name: 1,
        circle_no: 1,
        status: 1
      }
    }
  ]);

  return res.status(200).send({ success: true, data: circle_data });

  return res.status(200).send({ success: true, data: circle_data });
};

exports.deletecircle = async (req, res) => {
  id = req.body.id;
  await Circles.findByIdAndDelete({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Sorry unable to delete circle" });
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

exports.updatecircle = async (req, res) => {
  _id = req.body.id;
  const updateRecords = {
    ...req.body,
    modified_by: req.user.user_id,
    log_date_modified: new Date()
  };
  await Circles.findByIdAndUpdate(
    { _id },
    { ...updateRecords },
    (err, data) => {
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update circle" });
      } else if (data == null) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update circle" });
      } else if (data) {
        return res
          .status(404)
          .json({ status: true, message: "Updated circle successfully" });
      }
    }
  );
};

exports.getallcircles = async (req, res) => {
  const allcircles = await Circles.find({}, { _id: 1, name: 1 }).exec();
  return res.status(404).json({ status: true, data: allcircles });
};

exports.getzonewisecircles = async (req, res) => {
  //  console.log(req.body.zone_id);
  const z_id = req.body.zone_id;
  const allzonecircle = await Circles.find(
    { zones_id: { $in: z_id } },
    { _id: 1, name: 1 }
  );
  return res.status(200).json({ status: true, data: allzonecircle });
};
