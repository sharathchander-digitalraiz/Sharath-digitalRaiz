const Zones = require("../../../model/zones");
const Circles = require("../../../model/circles");
const Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
const Useraccess = require("../../../model/useraccess");
const User = require("../../../model/users");
const Department = require("../../../model/department");
const templeOperations = require("../../../model/temple_operations");
const Wards = require("../../../model/wards");

// temple report
exports.templeResport = async function (req, res) {
  //try {
  const { user_id, tenent_id, date_search, type } = req.body;
  let acc_dep_data = await User.findOne(
    { _id: user_id },
    { department_id: 1, user_access_id: 1 }
  ).exec();

  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  let formatted_date;
  if (date_search == "") {
    let dateTime = new Date();
    let d = new String(dateTime.getDate());
    let m = new String(dateTime.getMonth() + 1);

    let todayDate;
    let thisMonth;

    if (d.length == 1) {
      todayDate = "0" + d;
    } else {
      todayDate = dateTime.getDate();
    }

    if (m.length == 1) {
      thisMonth = "0" + m;
    } else {
      thisMonth = dateTime.getMonth() + 1;
    }

    formatted_date = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;
  } else {
    formatted_date = date_search;
  }
  let final_array = [];
  console.log(formatted_date);
  switch (role_data.name) {
    case "Admin":
      final_array = await admindata(tenent_id, type, formatted_date);
      break;
    default:
      final_array = await userdata(acc_dep_data, type, formatted_date);
      break;
  }
  return res.status(200).send({ login: true, status: true, data: final_array });
  // } catch (err) {
  //      return res.status(400).send({ login: true, status: false,message:"Something went wrong.Please try again"});
  // }
};

async function admindata(tenent_id, type, formatted_date) {
  const zones_details = await Zones.find({
    tenent_id: ObjectId(tenent_id)
  }).exec();
  console.log(tenent_id);
  let final_array = [];
  await Promise.all(
    zones_details.map(async (val) => {
      let obj = { zone_name: val.name };
      obj["circle_details"] = [];
      obj["total"] = [];
      const circle_details = await Circles.find({
        zones_id: val._id,
        tenent_id: tenent_id
      }).exec();
      let count = 0;
      let count_present = 0;
      let count_abscent = 0;

      let ZOnecount = 0;
      let ZOnecount_present = 0;
      let ZOnecount_abscent = 0;

      await Promise.all(
        circle_details.map(async (val) => {
          let cir_obj = { circle_no: val.circle_no, circle_name: val.name };
          const total = await templeOperations
            .find({
              circles_id: val._id,
              type: type,
              date: formatted_date
            })
            .countDocuments();
          console.log(type);

          count_present = await templeOperations
            .find({
              circles_id: val._id,
              type: type,
              date: formatted_date,
              attend: "1"
            })
            .countDocuments();
          cir_obj["total"] = total;
          count = count + total;
          ZOnecount = ZOnecount + total;
          cir_obj["total_present"] = count_present;
          ZOnecount_present = ZOnecount_present + count_present;
          cir_obj["total_abscent"] = total - count_present;
          ZOnecount_abscent = ZOnecount_abscent + (total - count_present);
          obj["circle_details"].push(cir_obj);
        })
      );
      obj["total"].push({
        count: count,
        count_present: ZOnecount_present,
        count_abscent: ZOnecount_abscent
      });
      final_array.push(obj);
    })
  );
  return final_array;
}
async function userdata(acc_dep_data, type, formatted_date) {
  const access_data = await Useraccess.findOne({
    _id: acc_dep_data.user_access_id
  }).exec();
  let acc_zones = [];
  let acc_circles = [];

  acc_zones = access_data["zones"].map((val) => {
    return ObjectId(val);
  });

  acc_circles = access_data["circles"].map((val) => {
    return ObjectId(val);
  });

  const zones_details = await Zones.find({ _id: { $in: acc_zones } }).exec();
  let final_array = [];
  await Promise.all(
    zones_details.map(async (val) => {
      let obj = { zone_name: val.name };
      obj["circle_details"] = [];
      obj["total"] = [];
      const circle_details = await Circles.find({
        zones_id: val._id,
        _id: { $in: acc_circles }
      }).exec();
      let count = 0;
      let count_present = 0;
      let count_abscent = 0;
      await Promise.all(
        circle_details.map(async (val) => {
          let cir_obj = { circle_no: val.circle_no, circle_name: val.name };
          const total = await templeOperations
            .find({
              circles_id: val._id,
              type: type,
              date: formatted_date
            })
            .countDocuments();
          const total_present = await templeOperations
            .find({
              circles_id: val._id,
              type: type,
              date: formatted_date,
              attend: 1
            })
            .countDocuments();
          cir_obj["total"] = total;
          count = count + total;
          cir_obj["total_present"] = total_present;
          count_present = count_present + total_present;
          cir_obj["total_abscent"] = total - total_present;
          count_abscent = count_abscent + (total - count_present);
          obj["circle_details"].push(cir_obj);
        })
      );
      obj["total"].push({
        count: count,
        count_present: count_present,
        count_abscent: count_abscent
      });
      final_array.push(obj);
    })
  );
  return final_array;
}

/************************* temple Ward Wise Report *******************************/
exports.templeWardWiseReport = async function (req, res) {
  //try {
  const { user_id, tenent_id, date_search, type } = req.body;
  let acc_dep_data = await User.findOne({ _id: user_id }, {}).exec();
  let role_data = await Department.findOne(
    { _id: acc_dep_data.department_id },
    { name: 1 }
  );

  let formatted_date;
  if (date_search == "") {
    let dateTime = new Date();
    let d = new String(dateTime.getDate());
    let m = new String(dateTime.getMonth() + 1);

    let todayDate;
    let thisMonth;

    if (d.length == 1) {
      todayDate = "0" + d;
    } else {
      todayDate = dateTime.getDate();
    }

    if (m.length == 1) {
      thisMonth = "0" + m;
    } else {
      thisMonth = dateTime.getMonth() + 1;
    }

    formatted_date = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;
  } else {
    formatted_date = date_search;
  }
  let final_array = [];
  console.log(formatted_date);
  switch (role_data.name) {
    case "Admin":
      final_array = await adminWarddata(tenent_id, type, formatted_date);
      break;
    default:
      final_array = await userwarddata(acc_dep_data, type, formatted_date);
      break;
  }
  return res.status(200).send({ login: true, status: true, data: final_array });
  // } catch (err) {
  //      return res.status(400).send({ login: true, status: false,message:"Something went wrong.Please try again"});
  // }
};

async function adminWarddata(tenent_id, type, formatted_date) {
  const zones_details = await Zones.find({
    tenent_id: ObjectId(tenent_id)
  }).exec();
  console.log(tenent_id);
  let final_array = [];
  await Promise.all(
    zones_details.map(async (val) => {
      const wardcount = await Wards.find({
        zones_id: val._id
      }).countDocuments();
      console.log(wardcount);

      let obj = { zone_name: val.name, wardCount: wardcount };

      obj["circleData"] = [];
      // obj["wardData"] = [];
      obj["total"] = [];
      const circle_details = await Circles.find({
        zones_id: val._id,
        tenent_id: tenent_id
      }).exec();
      let count = 0;
      let count_present = 0;
      let count_abscent = 0;

      let ZOnecount = 0;
      let ZOnecount_present = 0;
      let ZOnecount_abscent = 0;

      await Promise.all(
        circle_details.map(async (cval, i) => {
          let cir_obj = { circle_no: cval.circle_no, circle_name: cval.name };
          cir_obj["wardData"] = [];
          cir_obj["total"] = [];
          //cir_obj["wardData"]['total']=[];
          //  cir_obj["circleData"]['wardData']['total']=[];

          let wardcount = 0;
          let wardcount_present = 0;
          let wardcount_abscent = 0;

          const wardData = await Wards.find({
            circles_id: cval._id,
            tenent_id: tenent_id
          }).exec();
          //  cir_obj["wardData"][]['total']=[];
          await Promise.all(
            wardData.map(async (wval) => {
              let ward_obj = { ward_no: wval.wards_no, ward_name: wval.name };
              // cir_obj['wardData']["ward_no"]=wval.wards_no;
              // cir_obj['wardData']["ward_name"]=wval.name;
              count = await templeOperations
                .find({
                  ward_id: wval._id,
                  type: type,
                  date: formatted_date
                })
                .countDocuments();

              count_present = await templeOperations
                .find({
                  ward_id: wval._id,
                  type: type,
                  date: formatted_date,
                  attend: "1"
                })
                .countDocuments();
              ward_obj["total"] = count;

              ZOnecount = ZOnecount + count;
              wardcount = wardcount + count;
              ward_obj["total_present"] = count_present;
              ZOnecount_present = ZOnecount_present + count_present;
              wardcount_present = wardcount_present + count_present;
              ward_obj["total_abscent"] = count - count_present;
              ZOnecount_abscent = ZOnecount_abscent + (count - count_present);
              wardcount_abscent = wardcount_abscent + (count - count_present);

              cir_obj["wardData"].push(ward_obj);
            })
          );
          cir_obj["total"].push({
            count: wardcount,
            count_present: wardcount_present,
            count_abscent: count_abscent
          });

          obj["circleData"].push(cir_obj);
        })
      );
      obj["total"].push({
        count: count,
        count_present: ZOnecount_present,
        count_abscent: ZOnecount_abscent
      });
      final_array.push(obj);
    })
  );
  return final_array;
}
async function userwarddata(acc_dep_data, type, formatted_date) {
  const access_data = await Useraccess.findOne({
    _id: acc_dep_data.user_access_id
  }).exec();
  console.log(access_data);
  let acc_zones = [];
  let acc_circles = [];
  let acc_wards = [];

  acc_zones = access_data["zones"].map((val) => {
    return ObjectId(val);
  });

  acc_circles = access_data["circles"].map((val) => {
    return ObjectId(val);
  });
  acc_wards = access_data["ward"].map((val) => {
    return ObjectId(val);
  });

  const zones_details = await Zones.find({ _id: { $in: acc_zones } }).exec();
  let final_array = [];
  await Promise.all(
    zones_details.map(async (val) => {
      const wardcount = await Wards.find({
        zones_id: val._id,
        _id: { $in: acc_wards }
      }).countDocuments();

      let obj = { zone_name: val.name, wardCount: wardcount };
      obj["circleData"] = [];
      obj["total"] = [];
      const circle_details = await Circles.find({
        zones_id: val._id,
        _id: { $in: acc_circles }
      }).exec();

      let count = 0;
      let count_present = 0;
      let count_abscent = 0;

      let ZOnecount = 0;
      let ZOnecount_present = 0;
      let ZOnecount_abscent = 0;
      await Promise.all(
        circle_details.map(async (cval) => {
          let cir_obj = { circle_no: cval.circle_no, circle_name: cval.name };
          cir_obj["wardData"] = [];
          cir_obj["total"] = [];

          let wardcount = 0;
          let wardcount_present = 0;
          let wardcount_abscent = 0;

          const wardData = await Wards.find({
            circles_id: cval._id,
            _id: { $in: acc_wards }
          }).exec();
          console.log(wardData);
          //  cir_obj["wardData"][]['total']=[];
          await Promise.all(
            wardData.map(async (wval) => {
              let ward_obj = { ward_no: wval.wards_no, ward_name: wval.name };
              // cir_obj['wardData']["ward_no"]=wval.wards_no;
              // cir_obj['wardData']["ward_name"]=wval.name;
              count = await templeOperations
                .find({
                  ward_id: wval._id,
                  type: type,
                  date: formatted_date
                })
                .countDocuments();

              count_present = await templeOperations
                .find({
                  ward_id: wval._id,
                  type: type,
                  date: formatted_date,
                  attend: "1"
                })
                .countDocuments();
              ward_obj["total"] = count;

              ZOnecount = ZOnecount + count;
              wardcount = wardcount + count;
              ward_obj["total_present"] = count_present;
              ZOnecount_present = ZOnecount_present + count_present;
              wardcount_present = wardcount_present + count_present;
              ward_obj["total_abscent"] = count - count_present;
              ZOnecount_abscent = ZOnecount_abscent + (count - count_present);
              wardcount_abscent = wardcount_abscent + (count - count_present);
              cir_obj["wardData"].push(ward_obj);
            })
          );
          cir_obj["total"].push({
            count: wardcount,
            count_present: wardcount_present,
            count_abscent: wardcount_abscent
          });

          obj["circleData"].push(cir_obj);
        })
      );
      obj["total"].push({
        count: ZOnecount,
        count_present: ZOnecount_present,
        count_abscent: ZOnecount_abscent
      });
      final_array.push(obj);
    })
  );
  return final_array;
}
