const Circles = require("../../model/circles");
const departmentModel = require("../../model/department");
const templeModel = require("../../model/temple");
const Useraccess = require("../../model/useraccess");
const userModel = require("../../model/users");
const mongoose = require("mongoose");
const fs = require("fs");
const operationsModel = require("../../model/operations");

exports.templeChurchMasjid_report = async (req, res) => {
  let searchHoly = {};

  searchHoly.status = "Active";
  searchHoly.db_type = "temples";

  if (req.body.user_id) {
    searchHoly.user_id = req.body.user_id;
  }
  if (req.body.zones_id) {
    searchHoly.zones_id = req.body.zones_id;
  }
  if (req.body.circles_id) {
    searchHoly.circles_id = req.body.circles_id;
  }
  if (req.body.ward_id) {
    searchHoly.ward_id = req.body.ward_id;
  }
  if (req.body.area_id) {
    searchHoly.area_id = req.body.area_id;
  }

  console.log(searchHoly);

  const holyPlaces = await operationsModel.find(searchHoly);

  res.status(200).send({
    login: true,
    status: true,
    // result: userToken,
    // type: type,
    // headers: head
    holyPlaces
  });
};
