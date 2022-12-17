const Zones = require("../../model/zones");
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

exports.getzones = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

async function admindata(tenent_id) {
  const showZone = await Zones.find({ tenent_id: ObjectId(tenent_id) }).exec();

  let documents = [];
  let i = 0;

  await Promise.all(
    showZone.map(async (d) => {
      const tenet = await tenent.findOne(
        { _id: d.tenent_id },
        { _id: 1, name: 1 }
      );

      const uzer = await userModel.findOne(
        { _id: d.created_by },
        { _id: 1, last_name: 1 }
      );

      documents[i] = {};
      documents[i]._id = d._id;
      documents[i].zone_no = d.zone_no;
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

  acc_zones = access_data["zones"].map((val) => {
    return ObjectId(val);
  });

  const showZone = await Zones.find({ _id: { $in: acc_zones } }).exec();

  //   console.log(showZone);
  await Promise.all(
    showZone.map(async (d) => {
      const tenet = await tenent.findOne(
        { _id: d.tenent_id },
        { _id: 1, name: 1 }
      );

      const uzer = await userModel.findOne(
        { _id: d.created_by },
        { _id: 1, last_name: 1 }
      );

      // console.log(tenet);

      let zoneDetails = {};
      zoneDetails._id = d._id;
      zoneDetails.zone_no = d.zone_no;
      zoneDetails.name = d.name;
      zoneDetails.tenent_id = d.tenent_id;
      zoneDetails.tenent = tenet.name;
      zoneDetails.created_id = d.created_by;
      zoneDetails.created = uzer.last_name;

      // console.log(zoneDetails);

      documents.push(zoneDetails);
      // console.log(documents);
    })

    //   console.log(documents);
  );
  return documents;
}

// exports.getzones = async (req, res) => {
//    const allzones = await Zones.find({},{_id:1,name:1}).exec();
//     const zones = await Zones.aggregate([
//         // Join with user_info table
//        // [ { $match : { tenent_id : req.body.tenent_id } } ],
//         {
//             $lookup:{
//                 from: "users",              // other table name
//                 localField: "created_by",   // name of users table field
//                 foreignField: "_id",        // name of userinfo table field
//                 as: "created_user"          // alias for userinfo table
//             }
//         },
//         {   $unwind:"$created_user" },
//         {
//             $lookup:{
//                 from: "tenents",             // other table name
//                 localField: "tenent_id",     // name of users table field
//                 foreignField: "_id",         // name of userinfo table field
//                 as: "tenent_info"            // alias for userinfo table
//             }
//         },                                   // define which fields are you want to fetch
//         {
//             $unwind:"$tenent_info"
//         },
//         {
//             $project:{
//                 _id : 1,
//                 name : 1,
//                 status:1,
//                 zone_no:1,
//                 tenent : "$tenent_info.name",
//                 created : "$created_user.last_name",
//             }
//         }
//          // define which fields are you want to fetch
//     ]).exec();
//     console.log(allzones);
//     return res.status(200).json({status:true,message:'Success',data:zones});

// }

exports.deletezone = async (req, res) => {
  id = req.body.id;
  await Zones.findByIdAndDelete({ _id: id }, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ status: false, message: "Sorry unable to delete zone" });
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

exports.editzones = async (req, res) => {
  const id = req.body.id;
  await Zones.findOne(
    { _id: id },
    { _id: 1, name: true, tenent_id: true, zone_no: true },
    (err, data) => {
      if (err) {
        return res
          .status(400)
          .json({ status: false, message: "Zones list not exists" });
      } else {
        return res.status(200).json({ status: true, data });
      }
    }
  );
};

exports.updatezone = async (req, res) => {
  const _id = req.body.id;
  const updateRecords = {
    ...req.body,
    modified_by: req.user.user_id,
    log_date_modified: new Date()
  };
  await Zones.findByIdAndUpdate({ _id }, { ...updateRecords }, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ status: false, message: "Sorry unable to update zone" });
    } else if (data) {
      return res
        .status(200)
        .json({ status: true, message: "Zone updated successfully" });
    }
  });
};

exports.getallzones = async (req, res) => {
  const allzones = await Zones.find({}, { _id: 1, name: 1 }).exec();
  return res.status(200).json({ status: true, data: allzones });
};

exports.getalltenentszones = async (req, res) => {
  tenent_id = req.body.tenent_id;
  await Zones.find(
    { tenent_id: tenent_id },
    { _id: 1, name: 1 },
    (err, data) => {
      if (err)
        return res
          .status(400)
          .json({ status: false, message: "Sorry unable to update zone" });
      if (data == null) {
        data = [];
      }
      return res.status(200).json({ status: true, data: data });
    }
  );
};
