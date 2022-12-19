const servicestypes = require("../../model/servicetype");
const support = require("../../model/support");
const zone = require("../../model/zones");
const circle = require("../../model/circles");
const tenent = require("../../model/tenent");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
var multer = require("multer");
exports.services_type = async (req, res) => {
  let services = await servicestypes
    .find({ status: "Active" }, { _id: 0, id: "$_id", name: 1 })
    .exec();
  responseObject = {
    success: true,
    login: true,
    message: "Successfully completed",
    data: services,
  };
  res.status(200).json(responseObject);
};

exports.add_support = async (req, res) => {
  const { user_id, support_list_id, description, zones_id, circles_id } =
    req.body;
  console.log(req.body);
  const zonerow = await zone
    .findOne({ _id: zones_id }, { _id: 1, name: 1, tenent_id: 1 })
    .exec();
  // const tenentrow = await tenent.findOne({ _id: zonerow.tenent_id}, {_id: 1 }).exec();
  // console.log(zonerow);
  const circlerow = await circle
    .findOne({ _id: circles_id }, { _id: 1, name: 1, circle_no: 1 })
    .exec();
  const image = req.file.filename;
  const su = new support({
    user_id: user_id,
    support_list_id: support_list_id,
    zones_id: zones_id,
    zone: zonerow.name,
    circle: circlerow.name,
    circles_id: circles_id,
    description: description,
    created_by: user_id,
    reason: null,
    image: image,
    tenent_id: zonerow.tenent_id,
  });
  su.save((error, data) => {
    if (error)
      return res
        .status(400)
        .json({
          success: false,
          login: true,
          message: "Something went wrong.Please try again",
        });
    if (data) {
      responseObject = {
        success: true,
        login: true,
        message: "Saved successfully",
      };
      res.status(200).json(responseObject);
    }
  });
};


exports.getallcomplaint = async (req, res) => {
  const alldata = await support
    .aggregate([
      {
        $lookup: {
          from: "servicestypes", // other table name
          localField: "support_list_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "servicetype", // alias for userinfo table
        },
      },
      { $unwind: "$servicetype" },
      {
        $lookup: {
          from: "zones", // other table name
          localField: "zones_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "zones_info", // alias for userinfo table
        },
      }, // define which fields are you want to fetch
      { $unwind: "$zones_info" },
      {
        $lookup: {
          from: "circles", // other table name
          localField: "circles_id", // name of users table field
          foreignField: "_id", // name of userinfo table field
          as: "circle_info", // alias for userinfo table
        },
      }, // define which fields are you want to fetch
      { $unwind: "$circle_info" },
      {
        $project: {
          id: "$_id",
          description: 1,
          status: 1,
          reason: 1,
          zones_id: 1,
          circles_id: 1,
          support_list_id: 1,
          circle_name: "$circle_info.name",
          zone_name: "$zones_info.name",
          service_name: "$servicetype.name",
        },
      },
    ])
    .exec();
  return res
    .status(200)
    .json({ status: true, message: "Success", data: alldata });
};

exports.editcomplaint = async (req, res) => {
  const id = req.body.id;

  const alldata = await support.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: "zones", // other table name              //
        localField: "zones_id", // name of users table field     //
        foreignField: "_id", // name of userinfo table field  //
        as: "zones_info", // alias for userinfo table      //
      },
    }, // define which fields are you want to fetch
    { $unwind: "$zones_info" },
    {
      $lookup: {
        from: "circles", // other table name
        localField: "circles_id", // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "circle_info", // alias for userinfo table
      },
    }, // define which fields are you want to fetch
    { $unwind: "$circle_info" },
    {
      $lookup: {
        from: "servicestypes", // other table name              //
        localField: "support_list_id", // name of users table field     //
        foreignField: "_id", // name of userinfo table field  //
        as: "service_type", // alias for userinfo table      //
      },
    }, // define which fields are you want to fetch
    { $unwind: "$service_type" },
    {
      $lookup: {
        from: "tenents", // other table name
        localField: "tenent_id", // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "tenent_info", // alias for userinfo table
      },
    }, // define which fields are you want to fetch
    { $unwind: "$tenent_info" },
    {
      $project: {
        _id: 1,
        zone_name: "$zones_info.name",
        circle_name: "$circle_info.name",
        servicestype: "$service_type.name",
        tenent_name: "$tenent_info.name",
        support_list_id: 1,
        description: 1,
        reason: 1,
        image: 1,
        zones_id: 1,
        circles_id: 1,
        status: 1,
        tenent_id: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json({ status: true, message: "Success", data: alldata });
};

exports.updatecomplaint = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(404).json({ status: false, message: "Id is required" });
  }

  const updateRecords = {
    ...req.body,
  };
  await support.findByIdAndUpdate(
    { _id: id },
    { ...updateRecords },
    (err, data) => {
      //  console.log(data);
      if (err) {
        return res
          .status(404)
          .json({ status: false, message: "Sorry unable to update" });
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

exports.deletecomplaint = async (req, res) => {
  const _id = req.body.id;

  await support.findByIdAndDelete({ _id }, (err, data) => {
    //  console.log(data);
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Sorry unable to delete" });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Deleted Successfully" });
    }
  });
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/complaint/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage: storage });
