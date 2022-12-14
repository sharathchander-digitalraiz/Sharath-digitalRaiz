const employeeRoutes = require("express").Router();

// import functions
const employee = require("../../../controller/admin/employee.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");
const { verifyAdminToken } = require("../../../middleware/tokenVerify");

// defining the routes
employeeRoutes.post(
  "/addemployee",
  verifyAdminToken,
  upload_userImages.none(),
  employee.addEmployee
);

employeeRoutes.post("/employeesignin", employee.userLogin);

employeeRoutes.post(
  "/getallemployees",
  verifyAdminToken,
  employee.getAllSuperEmployees
);

employeeRoutes.post("/getemplprofile", verifyAdminToken, employee.getProfile);

employeeRoutes.put(
  "/editemplprofile",
  verifyAdminToken,
  upload_userImages.none(),
  employee.editProfile
);

employeeRoutes.post(
  "/removeemplprofile",
  verifyAdminToken,
  employee.removeEmployee
);

// disable employee
employeeRoutes.patch(
  "/emplstatuschange/:id",
  verifyAdminToken,
  employee.employeeStatusChange
);

employeeRoutes.patch(
  "/editprofilepic",
  verifyAdminToken,
  upload_userImages.single("profImg"),
  employee.updateProfilePic
);

employeeRoutes.patch(
  "/changepass",
  verifyAdminToken,
  employee.changeUserPassword
);

employeeRoutes.post(
  "/getloginhistory",
  verifyAdminToken,
  employee.getHistorySuperadmin
);

module.exports = employeeRoutes;
