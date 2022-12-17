const express = require("express");
var cors = require("cors");

const {
  gettents,
  deletetenents,
  updatetenents,
  edittenents,
  tenetLogin
} = require("../../controllers/admin/gettenents");

const { uploadTenent } = require("../../controllers/tenent");
const {
  import_data_residential,
  upload_user_res
} = require("../../controllers/admin/residential_upload_excel");
const {
  getProfile,
  updateProfile,
  upload_profile,
  changePassword
} = require("../../controllers/admin/get_profile");
const {
  getzones,
  deletezone,
  updatezone,
  editzones,
  getallzones,
  getalltenentszones
} = require("../../controllers/admin/getzones");
const {
  getcircles,
  deletecircle,
  updatecircle,
  editcircles,
  getallcircles,
  getzonewisecircles
} = require("../../controllers/admin/getCircles");
const {
  getwards,
  deleteward,
  updateward,
  editwards,
  getallwards,
  getcirclewisewards
} = require("../../controllers/admin/getWards");
const {
  getLandmarks,
  deletelandmark,
  updatelandmark,
  editlandmarks,
  getwardwiselandmark,
  getareawiselandmark,
  admin_getareawiselandmark
} = require("../../controllers/admin/getlandmark");
const {
  validatezones,
  isRequestValidated,
  validatezoneid,
  isRequestValidatedZoneId
} = require("../../validators/zones");
const {
  validatecircles,
  isRequestValidatedcircle,
  validatecircleid,
  isRequestValidatedCircleId
} = require("../../validators/circles");
const {
  validatewards,
  isRequestValidatedward
} = require("../../validators/wards");
const {
  validatelandmarks,
  isRequestValidatelandmark
} = require("../../validators/landmark");
const {
  getuseraccess,
  edituseraccess,
  updateuseraccess,
  deleteuseraccess
} = require("../../controllers/admin/getuseraccess");
const upload = require("../../controllers/app/transfer").upload;
const {
  validateusers,
  isRequestValidateuser,
  validatesingleusers,
  isRequestvalidatesingleusers,
  validateupdateusers,
  isRequestValidateupdateuser
} = require("../../validators/users");
const {
  validatetenents,
  isRequestValidatedtenent,
  validatetenentid,
  isRequestValidatedTenentId
} = require("../../validators/tenents");
const { requireSignin } = require("../../common-middleware");
const {
  validatearea,
  isRequestValidatedarea,
  validataddearea,
  isRequestvalidataddearea
} = require("../../validators/area");
const {
  getallarea,
  deletearea,
  updatearea,
  editarea,
  getallareas,
  getwardwisearea,
  createarea
} = require("../../controllers/admin/getareas");
const { validateid, isRequestValidatedId } = require("../../validators/zones");
const {
  getUsers,
  addUser,
  singleUser,
  updateUser,
  deleteUser,
  getSFAUsers
} = require("../../controllers/admin/getUsers");
const {
  editvalidatevehicles,
  isRequestValidatededitvehicles
} = require("../../validators/vehicles");
const {
  getVehicles,
  updatevehicles,
  editvehicles,
  deleteVehicles,
  vehicle_upload
} = require("../../controllers/admin/getVehicles");
/* Admin Gvp Bep */
const {
  add_admin_gvp_bep,
  getalladmingvpbep,
  edit_admingvpbep,
  update_admingvpbep,
  delete_admingvpbep
} = require("../../controllers/admin/gvpbep_admin");
const {
  validate_gvpbep_admin,
  isRequestValidated_admin_gvpbep
} = require("../../validators/admin_gvpbep_validator");

/* Validate Landmark*/
const {
  validatewardid,
  isRequestValidatedWardId
} = require("../../validators/landmark");

const {
  import_data_covid,
  upload_user_family
} = require("../../controllers/admin/family_import_upload");

const {
  import_data_vehicles
} = require("../../controllers/admin/vehicle_import_upload");

/* Owner type */
const {
  createowner_type,
  getallowner_type,
  editowner_type,
  deleteowner_type,
  updateowner_type,
  TenentAllowner_type
} = require("../../controllers/admin/owner_type");
const {
  validateowner_type,
  isRequestValidateowner_type
} = require("../../validators/owner_type");

/* Vehicle type */
const {
  createVechile_type,
  getallVechile_type,
  editVechile_type,
  deleteVechile_type,
  updateVechile_type,
  TenentallVechile_type
} = require("../../controllers/admin/vehicle_type_admin");
const {
  validateVechile_type,
  isRequestValidateVechile_type
} = require("../../validators/vehicle_type_validators");

/* House type */
const {
  createhouse_type,
  getallhouse_type,
  edithouse_type,
  deletehouse_type,
  updatehouse_type,
  Tenentallhouse_type
} = require("../../controllers/admin/house_type");
const {
  validatehouse_type,
  isRequestValidatehouse_type
} = require("../../validators/house_type_validator");

/* Disposal type */
const {
  createdisposal_type,
  getalldisposal_type,
  editdisposal_type,
  deletedisposal_type,
  updatedisposal_type,
  Tenentalldisposal_type
} = require("../../controllers/admin/disposal_type");
const {
  validatedisposal_type,
  isRequestValidatedisposal_type
} = require("../../validators/disposal_validator");

/* Business type */
const {
  createbusiness_type,
  getallbusiness_type,
  editbusiness_type,
  deletebusiness_type,
  updatebusiness_type,
  Tenentallbusiness_type
} = require("../../controllers/admin/business_type");
const {
  validatebusiness_type,
  isRequestValidatebusiness_type
} = require("../../validators/business_type_validator");

/* Culvert type */
const {
  createculvert_type,
  getallculvert_type,
  editculvert_type,
  deleteculvert_type,
  updateculvert_type,
  Tenentculvert_type
} = require("../../controllers/admin/culvert_type");
const {
  validateculvert_type,
  isRequestValidateculvert_type
} = require("../../validators/culvert_typevalidators");

/* Tenent user access */
const {
  createtenent_geoaccess,
  getalltenent_geoaccess,
  edittenent_geoaccess,
  deletetenent_geoaccess,
  updattenent_geoaccess
} = require("../../controllers/admin/tenent_geo_tagging_access");
const {
  validatetenents_geoaccess,
  isRequestValidatedtenents_geoaccess
} = require("../../validators/tenent_geo_validators");

/* Super admin */
const {
  addUser_sadmin,
  getUsers_sadmin,
  singleUser_sadmin,
  updateUser_sadmin,
  deleteUser_sadmin
} = require("../../controllers/admin/user_create_sadmin");

const {
  validateusers_super,
  isRequestValidateuser_super,
  validateupdateusers_super,
  isRequestValidateupdateuser_super
} = require("../../validators/user_superadmin");

/* Vehicles Attendance */
const {
  getallvehicles_attandance,
  getallvehicles_attandance_search
} = require("../../controllers/admin/getvehicleattendance");

/* TRANSFER STATION TRIPS COUNT */
const {
  gettransfer_station_trips_count,
  gettransfer_station_trips_count_search
} = require("../../controllers/admin/trasfer_stations_trips_count");

/* Dashboard Access */
const {
  admin_access_dashboard
} = require("../../controllers/admin/dashboard_acc_count");

/* Notification */
//const {createnotification, upload_notification, listofnotifications,deletenotification,tenent_notifications,delete_notification} = require('../../controllers/admin/notifications');

/* All Modules dashboard */
const {
  all_modules_dashboard
} = require("../../controllers/admin/all_modules_dashboard");

const {
  createnotification,
  upload_notification,
  listofnotifications,
  deletenotification,
  tenent_notifications,
  delete_notification,
  send_notification
} = require("../../controllers/admin/notifications");

const {
  validate_notifications,
  isRequestValidated_notifications
} = require("../../validators/notifications_validator");

/* App Notification */
const {
  app_notification,
  get_all_app_notification,
  update_notification,
  delete_notification_app,
  edit__notification,
  get_geotagtypes,
  get_departments
} = require("../../controllers/admin/app_notification");
const {
  validatenotification,
  isRequestValidatenotification
} = require("../../validators/app_notification");

const {
  import_data_comunityHall
} = require("../../controllers/admin/community_hall_upload_excel");
const {
  import_data_apartmentComplex,
  import_data_apartmentComplexFlats,
  import_data_commercial_memebers,
  upload_comercial_family
} = require("../../controllers/admin/appartment_complex_upload_excel");

var router = express.Router();
exports.routes = function (app) {
  app.post("/admin/api/gettents", upload.none(), requireSignin, gettents);
  app.post(
    "/admin/api/deletetenents",
    upload.none(),
    requireSignin,
    deletetenents
  );
  app.post("/admin/api/edittenents", upload.none(), requireSignin, edittenents);
  app.post(
    "/admin/api/updatetenents",
    uploadTenent.single("image"),
    requireSignin,
    validatetenents,
    isRequestValidatedtenent,
    updatetenents
  );
  app.post(
    "/admin/api/tenetLogin",
    uploadTenent.none(),
    requireSignin,
    tenetLogin
  );

  app.post("/admin/api/getzones_list", upload.none(), requireSignin, getzones);
  app.post("/admin/api/editzone", upload.none(), requireSignin, editzones);
  app.post("/admin/api/deletezone", upload.none(), requireSignin, deletezone);
  app.post(
    "/admin/api/updatezone",
    upload.none(),
    requireSignin,
    validatezones,
    isRequestValidated,
    updatezone
  );
  app.get("/admin/api/getallzones", requireSignin, getallzones);
  app.post(
    "/admin/api/getalltenentszones",
    upload.none(),
    requireSignin,
    validatetenentid,
    isRequestValidatedTenentId,
    getalltenentszones
  );

  app.post("/admin/api/getcircles", upload.none(), requireSignin, getcircles);
  app.post("/admin/api/editcircles", upload.none(), requireSignin, editcircles);
  app.post(
    "/admin/api/deletecircle",
    upload.none(),
    requireSignin,
    deletecircle
  );
  app.post(
    "/admin/api/updatecircle",
    upload.none(),
    requireSignin,
    validatecircles,
    isRequestValidatedcircle,
    updatecircle
  );
  app.get(
    "/admin/api/getallcircles",
    upload.none(),
    requireSignin,
    getallcircles
  );
  app.post(
    "/admin/api/getzonewisecircles",
    upload.none(),
    requireSignin,
    validatezoneid,
    isRequestValidatedZoneId,
    getzonewisecircles
  );

  app.post("/admin/api/getwards", upload.none(), requireSignin, getwards);
  app.post("/admin/api/editwards", upload.none(), requireSignin, editwards);
  app.post("/admin/api/deleteward", upload.none(), requireSignin, deleteward);
  app.post(
    "/admin/api/updateward",
    upload.none(),
    requireSignin,
    validatewards,
    isRequestValidatedward,
    updateward
  );
  app.get("/admin/api/getallwards", upload.none(), requireSignin, getallwards);
  app.post(
    "/admin/api/getcirclewisewards",
    upload.none(),
    requireSignin,
    validatecircleid,
    isRequestValidatedCircleId,
    getcirclewisewards
  );

  app.post("/admin/api/getallarea", upload.none(), requireSignin, getallarea);
  app.post(
    "/admin/api/createarea",
    upload.none(),
    requireSignin,
    validataddearea,
    isRequestvalidataddearea,
    createarea
  );
  app.post("/admin/api/deletearea", upload.none(), requireSignin, deletearea);
  app.post("/admin/api/editarea", upload.none(), requireSignin, editarea);
  app.post(
    "/admin/api/updatearea",
    upload.none(),
    requireSignin,
    validatearea,
    isRequestValidatedarea,
    updatearea
  );
  app.get("/admin/api/getallareas", requireSignin, getallareas);
  app.post(
    "/admin/api/getwardwisearea",
    upload.none(),
    requireSignin,
    getwardwisearea
  );

  app.post(
    "/admin/api/getlandmarks",
    upload.none(),
    requireSignin,
    getLandmarks
  );
  app.post(
    "/admin/api/editlandmarks",
    upload.none(),
    requireSignin,
    editlandmarks
  );
  app.post(
    "/admin/api/deletelandmark",
    upload.none(),
    requireSignin,
    deletelandmark
  );
  app.post(
    "/admin/api/updatelandmark",
    upload.none(),
    requireSignin,
    validatelandmarks,
    isRequestValidatelandmark,
    updatelandmark
  );

  app.post(
    "/admin/api/getusers",
    upload.none(),
    cors(),
    requireSignin,
    getUsers
  );
  app.post(
    "/admin/api/addusers",
    upload.none(),
    requireSignin,
    validateusers,
    isRequestValidateuser,
    addUser
  );
  app.post(
    "/admin/api/singleuser",
    upload.none(),
    cors(),
    requireSignin,
    validatesingleusers,
    isRequestvalidatesingleusers,
    singleUser
  );
  app.post(
    "/admin/api/updateuser",
    upload.none(),
    cors(),
    requireSignin,
    validateupdateusers,
    isRequestValidateupdateuser,
    updateUser
  );
  app.post(
    "/admin/api/deleteuser",
    upload.none(),
    requireSignin,
    validatesingleusers,
    isRequestvalidatesingleusers,
    deleteUser
  );

  app.post(
    "/admin/api/getuseraccess",
    upload.none(),
    requireSignin,
    getuseraccess
  );
  app.post(
    "/admin/api/edituseraccess",
    upload.none(),
    validateid,
    isRequestValidatedId,
    edituseraccess
  );
  app.post(
    "/admin/api/updateuseraccess",
    upload.none(),
    validateid,
    isRequestValidatedId,
    updateuseraccess
  );
  app.post(
    "/admin/api/deleteuseraccess",
    upload.none(),
    validateid,
    isRequestValidatedId,
    deleteuseraccess
  );

  app.post("/admin/api/getVehicles", upload.none(), requireSignin, getVehicles);
  app.post(
    "/admin/api/updatevehicles",
    vehicle_upload.single("image"),
    requireSignin,
    editvalidatevehicles,
    isRequestValidatededitvehicles,
    updatevehicles
  );
  app.post(
    "/admin/api/editvehicles",
    upload.none(),
    requireSignin,
    editvehicles
  );
  app.post(
    "/admin/api/deleteVehicles",
    upload.none(),
    requireSignin,
    deleteVehicles
  );
  /* 
   app.get('/admin/api/singleuser',requireSignin,validatesingleusers,isRequestvalidatesingleusers,singleUser);
   app.post('/admin/api/updateuser',requireSignin,validateupdateusers,isRequestValidateupdateuser,updateUser);
   app.post('/admin/api/deleteuser',requireSignin,validatesingleusers,isRequestvalidatesingleusers,deleteUser);
*/

  /* Admin Gvp Bep */
  app.post(
    "/add_admin_gvp_bep",
    upload.none(),
    validate_gvpbep_admin,
    isRequestValidated_admin_gvpbep,
    requireSignin,
    add_admin_gvp_bep
  );
  app.post("/getalladmingvpbep", requireSignin, getalladmingvpbep);
  app.post("/edit_admingvpbep", upload.none(), requireSignin, edit_admingvpbep);
  app.post(
    "/update_admingvpbep",
    upload.none(),
    requireSignin,
    update_admingvpbep
  );
  app.post(
    "/delete_admingvpbep",
    upload.none(),
    requireSignin,
    delete_admingvpbep
  );

  app.post(
    "/admin/api/getwardwiselandmark",
    upload.none(),
    requireSignin,
    validatewardid,
    isRequestValidatedWardId,
    getwardwiselandmark
  );

  app.post(
    "/admin/api/getareawiselandmark",
    upload.none(),
    getareawiselandmark
  );
  app.post(
    "/admin/api/admin_getareawiselandmark",
    upload.none(),
    admin_getareawiselandmark
  );

  /* Owner type */
  app.post(
    "/createowner_type",
    upload.none(),
    requireSignin,
    validateowner_type,
    isRequestValidateowner_type,
    createowner_type
  );
  app.get("/getallowner_type", upload.none(), requireSignin, getallowner_type);
  app.post(
    "/TenentAllowner_type",
    upload.none(),
    requireSignin,
    TenentAllowner_type
  );
  app.post("/editowner_type", upload.none(), requireSignin, editowner_type);
  app.post("/deleteowner_type", upload.none(), requireSignin, deleteowner_type);
  app.post(
    "/updateowner_type",
    upload.none(),
    requireSignin,
    validateowner_type,
    isRequestValidateowner_type,
    updateowner_type
  );

  /* Vehicle type */

  app.post(
    "/createVechile_type",
    upload.none(),
    requireSignin,
    validateVechile_type,
    isRequestValidateVechile_type,
    createVechile_type
  );
  app.get(
    "/getallVechile_type",
    upload.none(),
    requireSignin,
    getallVechile_type
  );
  app.post(
    "/TenentallVechile_type",
    upload.none(),
    requireSignin,
    TenentallVechile_type
  );
  app.post("/editVechile_type", upload.none(), requireSignin, editVechile_type);
  app.post(
    "/deleteVechile_type",
    upload.none(),
    requireSignin,
    deleteVechile_type
  );
  app.post(
    "/updateVechile_type",
    upload.none(),
    requireSignin,
    validateVechile_type,
    isRequestValidateVechile_type,
    updateVechile_type
  );

  /* House type */

  app.post(
    "/createhouse_type",
    upload.none(),
    requireSignin,
    validatehouse_type,
    isRequestValidatehouse_type,
    createhouse_type
  );
  app.get("/getallhouse_type", upload.none(), requireSignin, getallhouse_type);
  app.post(
    "/Tenentallhouse_type",
    upload.none(),
    requireSignin,
    Tenentallhouse_type
  );
  app.post("/edithouse_type", upload.none(), requireSignin, edithouse_type);
  app.post("/deletehouse_type", upload.none(), requireSignin, deletehouse_type);
  app.post(
    "/updatehouse_type",
    upload.none(),
    requireSignin,
    validatehouse_type,
    isRequestValidatehouse_type,
    updatehouse_type
  );

  /* Disposal type */

  app.post(
    "/createdisposal_type",
    upload.none(),
    requireSignin,
    validatedisposal_type,
    isRequestValidatedisposal_type,
    createdisposal_type
  );
  app.get(
    "/getalldisposal_type",
    upload.none(),
    requireSignin,
    getalldisposal_type
  );
  app.post(
    "/Tenentalldisposal_type",
    upload.none(),
    requireSignin,
    Tenentalldisposal_type
  );
  app.post(
    "/editdisposal_type",
    upload.none(),
    requireSignin,
    editdisposal_type
  );
  app.post(
    "/deletedisposal_type",
    upload.none(),
    requireSignin,
    deletedisposal_type
  );
  app.post(
    "/updatedisposal_type",
    upload.none(),
    requireSignin,
    validatedisposal_type,
    isRequestValidatedisposal_type,
    updatedisposal_type
  );

  /* Business type */

  app.post(
    "/createbusiness_type",
    upload.none(),
    requireSignin,
    validatebusiness_type,
    isRequestValidatebusiness_type,
    createbusiness_type
  );
  app.get(
    "/getallbusiness_type",
    upload.none(),
    requireSignin,
    getallbusiness_type
  );
  app.post(
    "/Tenentallbusiness_type",
    upload.none(),
    requireSignin,
    Tenentallbusiness_type
  );
  app.post(
    "/editbusiness_type",
    upload.none(),
    requireSignin,
    editbusiness_type
  );
  app.post(
    "/deletebusiness_type",
    upload.none(),
    requireSignin,
    deletebusiness_type
  );
  app.post(
    "/updatebusiness_type",
    upload.none(),
    requireSignin,
    validatebusiness_type,
    isRequestValidatebusiness_type,
    updatebusiness_type
  );

  /* Culvert type */

  app.post(
    "/createculvert_type",
    upload.none(),
    requireSignin,
    validateculvert_type,
    isRequestValidateculvert_type,
    createculvert_type
  );
  app.get(
    "/getallculvert_type",
    upload.none(),
    requireSignin,
    getallculvert_type
  );
  app.post(
    "/Tenentculvert_type",
    upload.none(),
    requireSignin,
    Tenentculvert_type
  );
  app.post("/editculvert_type", upload.none(), requireSignin, editculvert_type);
  app.post(
    "/deleteculvert_type",
    upload.none(),
    requireSignin,
    deleteculvert_type
  );
  app.post(
    "/updateculvert_type",
    upload.none(),
    requireSignin,
    validateculvert_type,
    isRequestValidateculvert_type,
    updateculvert_type
  );

  /* Tenent user access */
  app.post(
    "/createtenent_geoaccess",
    upload.none(),
    validatetenents_geoaccess,
    isRequestValidatedtenents_geoaccess,
    requireSignin,
    createtenent_geoaccess
  );
  app.get(
    "/getalltenent_geoaccess",
    upload.none(),
    requireSignin,
    getalltenent_geoaccess
  );
  app.post(
    "/edittenent_geoaccess",
    upload.none(),
    requireSignin,
    edittenent_geoaccess
  );
  app.post(
    "/deletetenent_geoaccess",
    upload.none(),
    requireSignin,
    deletetenent_geoaccess
  );
  app.post(
    "/updattenent_geoaccess",
    upload.none(),
    validatetenents_geoaccess,
    isRequestValidatedtenents_geoaccess,
    requireSignin,
    updattenent_geoaccess
  );

  /* User admin User create */

  app.post(
    "/getusers_sadmin",
    upload.none(),
    cors(),
    requireSignin,
    getUsers_sadmin
  );
  app.post(
    "/adduser_sadmin",
    upload.none(),
    requireSignin,
    validateusers_super,
    isRequestValidateuser_super,
    addUser_sadmin
  );
  app.post(
    "/singleuser_sadmin",
    upload.none(),
    requireSignin,
    validatesingleusers,
    isRequestvalidatesingleusers,
    singleUser_sadmin
  );
  app.post(
    "/updateuser_sadmin",
    upload.none(),
    requireSignin,
    validateupdateusers_super,
    isRequestValidateupdateuser_super,
    updateUser_sadmin
  );
  app.post(
    "/deleteuser_sadmin",
    upload.none(),
    requireSignin,
    validatesingleusers,
    isRequestvalidatesingleusers,
    deleteUser_sadmin
  );

  /* Vehicle Attandance */
  app.post(
    "/getallvehicles_attandance",
    upload.none(),
    requireSignin,
    getallvehicles_attandance
  );
  app.post(
    "/getallvehicles_attandance_search",
    upload.none(),
    requireSignin,
    getallvehicles_attandance_search
  );

  /* Transfer Station Trips Count */
  app.post(
    "/gettransfer_station_trips_count",
    upload.none(),
    requireSignin,
    gettransfer_station_trips_count
  );
  app.post(
    "/gettransfer_station_trips_count_search",
    upload.none(),
    requireSignin,
    gettransfer_station_trips_count_search
  );
  /* Access */
  app.post(
    "/admin/api/admin_access_dashboard",
    requireSignin,
    upload.none(),
    admin_access_dashboard
  );

  /* Notifications */
  app.post(
    "/admin/api/createnotification",
    requireSignin,
    upload_notification.single("image"),
    createnotification
  );

  app.post(
    "/listofnotifications",
    requireSignin,
    upload.none(),
    listofnotifications
  );
  app.post(
    "/deletenotification",
    requireSignin,
    upload.none(),
    deletenotification
  );
  app.post(
    "/tenent_notifications",
    requireSignin,
    upload.none(),
    tenent_notifications
  );
  app.post(
    "/delete_notification",
    requireSignin,
    upload.none(),
    delete_notification
  );

  app.post(
    "/listofnotifications",
    requireSignin,
    upload.none(),
    listofnotifications
  );
  app.post(
    "/deletenotification",
    requireSignin,
    upload.none(),
    deletenotification
  );
  app.post(
    "/tenent_notifications",
    requireSignin,
    upload.none(),
    tenent_notifications
  );
  app.post(
    "/delete_notification",
    requireSignin,
    upload.none(),
    delete_notification
  );
  app.post(
    "/send_notification",
    requireSignin,
    upload.single("image"),
    validate_notifications,
    isRequestValidated_notifications,
    send_notification
  );

  /* All modules dashboard */
  app.post(
    "/admin/api/all_adminmodules_dashboard",
    requireSignin,
    upload.none(),
    all_modules_dashboard
  );

  /* App Notification */
  app.post(
    "/admin/api/app_notification",
    upload.none(),
    requireSignin,
    validatenotification,
    isRequestValidatenotification,
    app_notification
  );
  app.post(
    "/admin/api/get_all_app_notification",
    upload.none(),
    requireSignin,
    get_all_app_notification
  );
  app.post(
    "/admin/api/update_notification",
    upload.none(),
    requireSignin,
    validatenotification,
    isRequestValidatenotification,
    update_notification
  );
  app.post(
    "/admin/api/delete_notification_app",
    upload.none(),
    requireSignin,
    delete_notification_app
  );
  app.post(
    "/admin/api/edit__notification",
    upload.none(),
    requireSignin,
    edit__notification
  );

  app.post(
    "/admin/api/get_geotagtypes",
    upload.none(),
    requireSignin,
    get_geotagtypes
  );
  app.post(
    "/admin/api/get_departments",
    upload.none(),
    requireSignin,
    get_departments
  );
  app.post("/admin/api/getsfausers", upload.none(), requireSignin, getSFAUsers);

  app.get("/admin/api/getprofile/:userId", getProfile);
  app.put(
    "/admin/api/updateprofile/:userId",
    upload_profile.single("profile"),
    updateProfile
  );
  app.put("/admin/api/changepassword", changePassword);

  /**********Import Resdential House *********************************/
  app.post(
    "/admin/api/import_data_residential",
    upload_user_res.single("file"),
    import_data_residential
  );
  app.post(
    "/admin/api/import_data_covid",
    upload_user_family.single("file"),
    import_data_covid
  );
  app.post(
    "/admin/api/import_data_comunityhall",
    upload_user_res.single("file"),
    import_data_comunityHall
  );
  app.post(
    "/admin/api/import_data_apartmentComplex",
    upload_user_res.single("file"),
    import_data_apartmentComplex
  );
  app.post(
    "/admin/api/import_data_apartmentComplexFlats",
    upload_user_res.single("file"),
    import_data_apartmentComplexFlats
  );
  app.post(
    "/admin/api/import_data_commercial_memebers",
    upload_comercial_family.single("file"),
    import_data_commercial_memebers
  );
  app.post(
    "/admin/api/import_data_vehicles",
    upload_comercial_family.single("file"),
    import_data_vehicles
  );
};
