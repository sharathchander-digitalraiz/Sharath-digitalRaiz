const communityHall_operation = require("../../model/communityHall_operation");
const complexBuilding_operation = require("../../model/complexBuilding_operation");
const manhole_operations = require("../../model/manhole_operations");
const openPlace_operation = require("../../model/openPlace_operation");
const parking_operation = require("../../model/parking_operation");
const residentialHouse_operation = require("../../model/residentialHouse_operation");
const streatVendor_operationModel = require("../../model/streatVendor_operation");
const templeOpModel = require("../../model/temple_operations");
//const gevpBepOpsModel = require("../../model/gvpBep_operation");

// get temple log history
exports.getTempleLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const templeLogHistory = await templeOpModel.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", templeLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get street vendor log history
exports.getStreetVendorLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const streetVendorLogHistory = await streatVendor_operationModel.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", streetVendorLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
exports.getManholeLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const ManholeLogHistory = await manhole_operations.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", ManholeLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
// open places log history
exports.getOpenPlaceLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const openPlaceLogHistory = await openPlace_operation.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", openPlaceLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// parking log history
exports.getParkingLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const parkingLogHistory = await parking_operation.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", parkingLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};


// complexBuilding log history
exports.getComplexBuildingLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const complexBuildingLogHistory = await complexBuilding_operation.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", complexBuildingLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// communityHall log history
exports.getCommunityHallLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const communityHallLogHistory = await communityHall_operation.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", communityHallLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
// residential houses log history
exports.getResidentialHousesLogHistory = async function (req, res) {
  try {
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

    let formattedDate = `${dateTime.getFullYear()}-${thisMonth}-${todayDate}`;

    const residentialHousesLogHistory = await residentialHouse_operation.find(
      {
        date: formattedDate,
        user_id: req.userId
      },
      {
        date: 1,
        user_id: 1,
        wt_type: 1,
        approx_weight: 1,
        picked_denied: 1,
        area: 1,
        landmark: 1
      }
    );

    res.status(200).json({ message: "Success", residentialHousesLogHistory });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};


