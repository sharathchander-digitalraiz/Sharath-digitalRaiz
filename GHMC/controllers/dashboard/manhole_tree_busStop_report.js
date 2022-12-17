const manholeTreeModel = require("../../model/man_hole_tree_busstop");
const operationsModel = require("../../model/operations");

exports.manholeTreeBusStop_report = async function (req, res) {
  try {
    let condition = {};

    condition.status = "Active";
    condition.db_type = "man_hole_tree_busstops";

    if (req.body.zones_id) {
      condition.zones_id = req.body.zones_id;
    }
    if (req.body.circles_id) {
      condition.circles_id = req.body.circles_id;
    }
    if (req.body.ward_id) {
      condition.ward_id = req.body.ward_id;
    }
    if (req.body.landmark_id) {
      condition.landmark_id = req.body.landmark_id;
    }
    if (req.body.area_id) {
      condition.area_id = req.body.area_id;
    }

    console.log(condition);

    const manholeReport = await operationsModel
      .find(condition)
      .sort({ log_date_created: -1 });

    res.status(200).send({
      login: true,
      status: true,
      manholeReport
    });
  } catch (err) {
    res.status(400).send({
      login: true,
      status: false,
      message: "Data not found"
    });
  }
};
