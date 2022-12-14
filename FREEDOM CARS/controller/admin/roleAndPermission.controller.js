const adminAuthModel = require("../../model/adminAuth");
const roleAndPermitModel = require("../../model/roleAndPermision");

// add roles and permissions
exports.addRoleAndPermission = function (req, res) {
  try {
    roleAndPermitModel
      .findOne({ roleName: req.body.roleName })
      .exec(async function (er, role) {
        if (role) {
          return res.status(400).json({ message: "Role is already added" });
        } else {
          const adminn = await adminAuthModel.findOne(
            { _id: req.userId },
            { name: 1 }
          );

          let logDate = new Date().toISOString().slice(0, 10);

          const roleObj = new roleAndPermitModel({
            roleName: req.body.roleName,
            rolePermission: req.body.rolePermission,
            createdBy: req.userId,
            logDateCreated: logDate,
            logDateModified: logDate
          });

          roleObj.save(function (eror, data) {
            if (eror) {
              return res
                .status(400)
                .json({ message: "Role could not be added" });
            }
            if (data) {
              res.status(200).json({ message: "Role added successfully" });
            }
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// get roles and permissions
exports.getRoleById = async function (req, res) {
  try {
    const roleResult = await roleAndPermitModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", roleResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get all roles and permissions
exports.getAllRoles = async function (req, res) {
  try {
    const rolesResult = await roleAndPermitModel.find().sort({ roleName: 1 });

    res.status(200).json({ message: "Success", rolesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// updated roles and permissions
exports.editRole = async function (req, res) {
  try {
    const changeRole = await roleAndPermitModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          roleName: req.body.roleName,
          rolePermission: req.body.rolePermission,
          logDateModified: logDate
        }
      },
      { new: true }
    );

    if (changeRole) {
      res
        .status(200)
        .json({ message: "Role and permissions updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// disable role and permission
exports.disableRole = async function (req, res) {
  try {
    const deactivateRole = await roleAndPermitModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: false
        }
      },
      { new: true }
    );

    if (deactivateRole) {
      res.status(200).json({ message: "Role deactivated successfully" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
