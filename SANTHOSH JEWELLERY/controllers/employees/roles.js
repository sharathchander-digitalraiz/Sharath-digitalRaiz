const Role = require("../../models/adminEmp/roles");
const Employee = require("../../models/adminEmp/adminEmpSchema");

//add Role
exports.addRole = async (req, res) => {
  try {
    const employeeData = await Employee.findById({ _id: req.admin });
    const roleAdded = new Role({
      role_name: req.body.role_name,
      access: req.body.access,
      created_by: employeeData.first_name,
      created_log_date: new Date().toISOString().slice(0, 10),
    }).save((err, data) => {
      if (err) {
        res
          .status(400)
          .json({
            success: false,
            message: "An error occurred while saving the data.",
            Error: err,
          });
      } else {
        res.status(200).json({
          success: true,
          message: "Saved successfully.",
        });
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//get one Role
exports.getRoleById = async (req, res) => {
  try {
    const rolesData = await Role.findById({ _id: req.params.id },{});
    if (rolesData) {
      res
        .status(200)
        .json({
          success: true,
          message: "The data was successfully retrieved.",
          rolesData,
        });
    } else {
      res.status(400).json({
        success: false,
        message: "something went wrong unable to find",
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//get all Roles
exports.getAllRoles = async (req, res) => {
  try {
    const RolesData = await Role.find({});
    if (RolesData) {
      res
        .status(200)
        .json({
          success: true,
          message: "The data was successfully retrieved.",
          RolesData,
        });
    } else {
      res.status(400).json({
        success: false,
        message: "something went wrong unable to find",
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//edit Roles
exports.editRole = async (req, res) => {
  try {
    const employeeData = await Employee.findById({ _id: req.admin });
    const RolesUpdate = await Role.findByIdAndUpdate(
      { _id: req.params.id },
      {
        role_name: req.body.role_name,
        access: req.body.access,
        modified_by: employeeData.first_name,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (RolesUpdate) {
      res.status(200).json({
        success: true,
        message: "updated successfully",
      });
    } else {
      res.status(400).json({ success: false, message: "inability to update " });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};

//delete Roles
exports.deleteRoles = async (req, res) => {
  try {
    const deleteRoles = await Role.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteRoles) {
      res.status(200).json({ success: true, message: "successfully deleted" });
    } else {
      res.status(400).json({
        success: false,
        message: "Something went wrong; we were unable to remove it. ",
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Something went wrong.", Error: err });
  }
};
