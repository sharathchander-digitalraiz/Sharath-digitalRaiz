const Departement = require("../../models/adminEmp/departments");

//add Departement
exports.addDepartement = async (req, res) => {
  try {
    const dept = new Departement({
        deptName: req.body.deptName
    }).save((err, data) => {
      if (err) {
        res.status(400).json({ success: false, message: err });
      } else {
        res.status(200).json({
          success: true,
          message: "Departement inserted successfully",
        });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get one Departement
exports.getOneDepartement= async (req, res) => {
  try {
    const departementData = await Departement.findById({ _id: req.params.id });
    if (departementData) {
      res
        .status(200)
        .json({ success: true, message: "successfull", departementData });
    } else {
      res.status(400).json({
        success: false,
        message: "something went wrong unable to find",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get all Departement
exports.getAllDepartement = async (req, res) => {
    try {
      const departementsData = await Departement.find({});
      if (departementsData) {
        res
          .status(200)
          .json({ success: true, message: "successfull", departementsData });
      } else {
        res.status(400).json({
          success: false,
          message: "something went wrong unable to find",
        });
      }
    } catch (err) {
      res.status(400).json({ success: false, message: err });
    }
  };

//edit Departement
exports.editDepartement = async (req, res) => {
  try {
    const updatedDepartement = await Departement.findByIdAndUpdate(
      { _id: req.params.id },
      {
        deptName: req.body.deptName
      }
    );
    if (updatedDepartement) {
      res.status(200).json({
        success: true,
        message: "items updated successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "unable to update the items" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete Departement
exports.deleteDepartement = async (req, res) => {
  try {
    const deletedDepartement = await Departement.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deletedDepartement) {
      res.status(200).json({ success: true, message: "successfully deleted" });
    } else {
      res.status(400).json({
        success: false,
        message: "something went wrong unable to delete",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
