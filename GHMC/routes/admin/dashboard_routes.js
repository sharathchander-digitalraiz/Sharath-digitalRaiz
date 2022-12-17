const express = require("express");

/* SIGN IN Require */
const { requireSignin } = require("../../common-middleware/index");

const {
  manhoelScan_cronjob
} = require("../../controllers/app/manhole_tree_busstop");

const {
  openPlaces_cronjob,
  Openplaces_report_search
} = require("../../controllers/app/open_place");
const {
  parking_cronjob,
  Parking_report_search
} = require("../../controllers/app/parking");
const {
  complexBuilding_cronjob,
  complex_report_search
} = require("../../controllers/app/commercial_building");

const {
  communityHall_cronjob,
  commuinity_report_search
} = require("../../controllers/app/communityhall");

const {
  getTempleLogHistory,
  getStreetVendorLogHistory,
  getManholeLogHistory,
  getOpenPlaceLogHistory,
  getParkingLogHistory,
  getComplexBuildingLogHistory,
  getCommunityHallLogHistory,
  getResidentialHousesLogHistory
} = require("../../controllers/app/logHistory");

const {
  residentialHouse_cronjob,
  residential_report_search
} = require("../../controllers/app/residential_house");

/*Admin Dashboard */
const {
  admin_dashboard_all_data,
  upload,
  culvert_issue_admin_dash,
  admin_gvp_bep_dash
} = require("../../controllers/dashboard/dashboard_api");
const {
  get_reports_vehicle_attendance,
  get_reports_search_vehicle_attendance
} = require("../../controllers/dashboard/reports_admin_api");
const {
  culvert_issue_report,
  culvert_issue_report_search,
  culvertAppIssueDashboard,
  culvertAppCircleIssueSDownload,
  culvertDownloadAppDashboard,
  Culvertscan_cronjob
} = require("../../controllers/dashboard/culvert_issue_report");

/* Operations Dashboard */
const {
  operations_report,
  operations_report_search
} = require("../../controllers/dashboard/operations_reports");

/* Toilets Operation */
const {
  toilets_operations_report,
  toilets_operations_report_search
} = require("../../controllers/dashboard/toilets_operations");

/* Vehicle Attendance report */
const {
  transport_vehicle_attendance,
  transport_vehicle_attendance_search
} = require("../../controllers/dashboard/transport_vehicle_attendance_reports");

/* Circle transfer station attendance report */
const {
  circle_transfer_station_attendance,
  circle_transfer_station_search
} = require("../../controllers/dashboard/circle_transfer_station_attendance");

/* Transport vehicle attendance timings */
const {
  transport_vehicle_attendance_timings,
  searchtransport_vehicle_attendance_timings
} = require("../../controllers/dashboard/transport_vehicle_attendance_timing");

/* Circle transport Sat attendance */
const {
  circle_transport_sat_today_attendance
} = require("../../controllers/dashboard/circle_transport_sat_today_attendance");

/* Transfer Station */
const {
  gettransfer_station_report
} = require("../../controllers/admin/transfer_station");

/* SAT VEHICLES REPORTS */

/* SFA SAT ATTENDANCE */
const {
  sfa_sat_attendance
} = require("../../controllers/admin/Sat_vehicles_report/sfa_sat_attendance");

/* Sfa sat attendance timings */
const {
  sfa_sat_attendance_times
} = require("../../controllers/admin/Sat_vehicles_report/sfa_sat_attendance_times");

/* Circle sat owner type attendance */
const {
  circle_sat_owner_type_attendance
} = require("../../controllers/admin/Sat_vehicles_report/circle_sat_owner_type_attendance");

/* Circle sat attendance time */
const {
  circle_sat_attendance_time
} = require("../../controllers/admin/Sat_vehicles_report/circle_sat_attendance_time");

/* Ward wise sat attendance */
const {
  ward_sat_attendance
} = require("../../controllers/admin/Sat_vehicles_report/ward_sat_attendance");

/* Transfer sat att trips */
const {
  transfer_sat_att_trips
} = require("../../controllers/admin/Sat_vehicles_report/transfer_sat_att_trips");

/* Circle sat attendance */
const {
  circle_sat_attendance
} = require("../../controllers/admin/Sat_vehicles_report/circle_sat_attendance");

/* Transfer station wise trips */
const {
  transfer_station_wise_trips
} = require("../../controllers/admin/Sat_vehicles_report/transfer_station_wise_trips");

/* Transfer station sta wise trips */
const {
  transfer_station_stawise_trips
} = require("../../controllers/admin/Sat_vehicles_report/transfer_station_stawise_trips");

/* Circle sat transport attendance */
const {
  circle_sat_transport_attendance
} = require("../../controllers/admin/Sat_vehicles_report/circle_sat_transport_attendance");

/* SFA SAT ATTENDANCE END */

/* TRANSPORT VEHICLES REPORTS */

const {
  transport_vehicles
} = require("../../controllers/admin/Transport_vehicles_report/transport_vehicles");
/* Transfer station trips wise */
const {
  transfer_station_wise_trips_first
} = require("../../controllers/admin/Transport_vehicles_report/transfer_station_wise_trips");
/* Transport vehicle owner type */
const {
  transport_vehicles_owner_type
} = require("../../controllers/admin/Transport_vehicles_report/transport_vehicles_owner_type");
/* arscvt */
const {
  arscvt
} = require("../../controllers/admin/Transport_vehicles_report/arscvt");

/* Circle Transfer station attendance */
const {
  circle_transfer_station_attendance_transport
} = require("../../controllers/admin/Transport_vehicles_report/circle_transfer_station_attendance");

/* Circle transport sat today attendance */
const {
  circle_transport_sat_today_attendance_trans
} = require("../../controllers/admin/Transport_vehicles_report/circle_transport_sat_today_attendance");

const {
  transferStationWiseTransportAttendanceBasedOnTrips
} = require("../../controllers/admin/Transport_vehicles_report/transferStationWiseTransportAttendanceBasedOnTrips");

const {
  circle_wise_sat_attendance
} = require("../../controllers/admin/Sat_vehicles_report/circle_wise_sat_attendance");

// send OTP and verify for forgot password
const {
  sendOtpEmail,
  compareOtp
} = require("../../controllers/admin/sendEmail");
const {
  transferStationTripCount
} = require("../../controllers/admin/Transport_vehicles_report/transferStationTripsCount");

var router = express.Router();
exports.routes = function (app) {
  /* Dashboard */
  app.post(
    "/admin/api/admin_dashboard_all_data",
    requireSignin,
    upload.none(),
    admin_dashboard_all_data
  );
  app.post(
    "/admin/api/culvert_issue_admin_dash",
    requireSignin,
    upload.none(),
    culvert_issue_admin_dash
  );
  app.post(
    "/admin/api/admin_gvp_bep_dash",
    requireSignin,
    upload.none(),
    admin_gvp_bep_dash
  );

  /* Reports */
  /* Vehicle reports */
  app.post(
    "/admin/api/get_reports_vehicle_attendance",
    requireSignin,
    upload.none(),
    get_reports_vehicle_attendance
  );
  app.post(
    "/admin/api/get_reports_search_vehicle_attendance",
    requireSignin,
    upload.none(),
    get_reports_search_vehicle_attendance
  );

  /* Culvert issue reports */
  app.post(
    "/admin/api/culvert_issue_report",
    requireSignin,
    upload.none(),
    culvert_issue_report
  );
  app.post(
    "/admin/api/culvert_issue_report_search",
    requireSignin,
    upload.none(),
    culvert_issue_report_search
  );

  /* Operation reports */
  app.post(
    "/admin/api/operations_report",
    requireSignin,
    upload.none(),
    operations_report
  );
  app.post(
    "/admin/api/operations_report_search",
    requireSignin,
    upload.none(),
    operations_report_search
  );

  /* Toilets Operation */
  app.post(
    "/admin/api/toilets_operations_report",
    requireSignin,
    upload.none(),
    toilets_operations_report
  );
  app.post(
    "/admin/api/toilets_operations_report_search",
    requireSignin,
    upload.none(),
    toilets_operations_report_search
  );

  /* Transport Vehicle Attendace */
  app.post(
    "/admin/api/transport_vehicle_attendance",
    requireSignin,
    upload.none(),
    transport_vehicle_attendance
  );
  app.post(
    "/admin/api/transport_vehicle_attendance_search",
    requireSignin,
    upload.none(),
    transport_vehicle_attendance_search
  );

  /* Transfer Station attendance report */
  app.post(
    "/admin/api/circle_transfer_station_attendance",
    requireSignin,
    upload.none(),
    circle_transfer_station_attendance
  );
  app.post(
    "/admin/api/circle_transfer_station_search",
    requireSignin,
    upload.none(),
    circle_transfer_station_search
  );

  /* Transport vehicle attendance timings */
  app.post(
    "/admin/api/transport_vehicle_attendance_timings",
    requireSignin,
    upload.none(),
    transport_vehicle_attendance_timings
  );
  app.post(
    "/admin/api/searchtransport_vehicle_attendance_timings",
    requireSignin,
    upload.none(),
    searchtransport_vehicle_attendance_timings
  );

  /* Circle Transport Sat attendance */
  app.post(
    "/admin/api/circle_transport_sat_today_attendance",
    requireSignin,
    upload.none(),
    circle_transport_sat_today_attendance
  );

  /* Transfer Station */
  app.post(
    "/gettransfer_station_report",
    upload.none(),
    gettransfer_station_report
  );

  /* SAT VEHICLES REPORTS */
  /* Sfa sat attendance */
  app.post(
    "/admin/api/sfa_sat_attendance",
    upload.none(),
    requireSignin,
    sfa_sat_attendance
  );

  /* sfa sat attendance timings */
  app.post(
    "/admin/api/sfa_sat_attendance_times",
    upload.none(),
    requireSignin,
    sfa_sat_attendance_times
  );

  /* Circle sat owner type attendance */
  app.post(
    "/admin/api/circle_sat_owner_type_attendance",
    upload.none(),
    requireSignin,
    circle_sat_owner_type_attendance
  );

  /* Circle sat attendance time */
  app.post(
    "/admin/api/circle_sat_attendance_time",
    upload.none(),
    requireSignin,
    circle_sat_attendance_time
  );

  /* Ward wise sat attendance */
  app.post(
    "/admin/api/ward_sat_attendance",
    upload.none(),
    requireSignin,
    ward_sat_attendance
  );

  /* Transfer Sat att trips */
  app.post(
    "/admin/api/transfer_sat_att_trips",
    upload.none(),
    requireSignin,
    transfer_sat_att_trips
  );

  /* Circle sat attendance */
  app.post(
    "/admin/api/circle_sat_attendance",
    upload.none(),
    requireSignin,
    circle_sat_attendance
  );

  /* Transfer Station wise trips */
  app.post(
    "/admin/api/transfer_station_wise_trips",
    upload.none(),
    requireSignin,
    transfer_station_wise_trips
  );

  /* Transfer Station STA wise trips */
  app.post(
    "/admin/api/transfer_station_stawise_trips",
    upload.none(),
    requireSignin,
    transfer_station_stawise_trips
  );

  /* Circle sat transport attendance */
  app.post(
    "/admin/api/circle_sat_transport_attendance",
    upload.none(),
    requireSignin,
    circle_sat_transport_attendance
  );

  /* SFA REPORTS END */

  /* TRANSPORT VEHICLE REPORT START */

  app.post(
    "/admin/api/transport_vehicles",
    upload.none(),
    requireSignin,
    transport_vehicles
  );

  /* Transfer station wise trips */
  app.post(
    "/admin/api/transfer_station_wise_trips_first",
    upload.none(),
    requireSignin,
    transfer_station_wise_trips_first
  );

  /* Transport vehicle owner type */
  app.post(
    "/admin/api/transport_vehicles_owner_type",
    upload.none(),
    requireSignin,
    transport_vehicles_owner_type
  );

  /* arscvt */
  app.post("/admin/api/arscvt", upload.none(), requireSignin, arscvt);

  /* Circle Transfer station attendance */
  app.post(
    "/admin/api/circle_transfer_station_attendance_transport",
    upload.none(),
    requireSignin,
    circle_transfer_station_attendance_transport
  );

  /* Circle transport sat today attendance */
  app.post(
    "/admin/api/circle_transport_sat_today_attendance_trans",
    upload.none(),
    requireSignin,
    circle_transport_sat_today_attendance_trans
  );

  // transferStationWiseTransportAttendanceBasedOnTrips
  app.post(
    "/admin/api/transferstationwisetransportattendancebasedontrips",
    upload.none(),
    requireSignin,
    transferStationWiseTransportAttendanceBasedOnTrips
  );

  // transferStationTripCount
  app.post(
    "/admin/api/transferStationTripCount",
    upload.none(),
    requireSignin,
    transferStationTripCount
  );

  // circle_wise_sat_attendance
  app.post(
    "/admin/api/circle_wise_sat_attendance",
    upload.none(),
    requireSignin,
    circle_wise_sat_attendance
  );

  // Forgot password..send OTP emil
  app.post(
    "/admin/api/otp/sendemail",
    upload.none(),
    requireSignin,
    sendOtpEmail
  );

  // Forgot password..compare OTP
  app.post(
    "/admin/api/otp/compareotp",
    upload.none(),
    requireSignin,
    compareOtp
  );
  app.post(
    "/culvertallissues_dashboard",
    upload.none(),
    requireSignin,
    culvertAppIssueDashboard
  );
  app.get(
    "/culvertAppCircleIssueSDownload/:circleId",
    upload.none(),
    culvertAppCircleIssueSDownload
  );
  app.get("/culvert_downloaddash/", upload.none(), culvertDownloadAppDashboard);
  app.get("/Culvertscan_cronjob", upload.none(), Culvertscan_cronjob);

  app.post(
    "/manholetreebusstop_cronjob",
    requireSignin,
    upload.none(),
    manhoelScan_cronjob
  );
  app.post(
    "/gettodaymanholelogs",
    requireSignin,
    upload.none(),
    getManholeLogHistory
  );

  app.post(
    "/openplace_cronjob",
    requireSignin,
    upload.none(),
    openPlaces_cronjob
  );
  app.post(
    "/Openplaces_report_search",
    requireSignin,
    upload.none(),
    Openplaces_report_search
  );
  app.post(
    "/gettodayopenplacelogs",
    requireSignin,
    upload.none(),
    getOpenPlaceLogHistory
  );

  app.post("/parking_cronjob", requireSignin, upload.none(), parking_cronjob);
  app.post(
    "/Parking_report_search",
    requireSignin,
    upload.none(),
    Parking_report_search
  );
  app.post(
    "/gettodayopenplacelogs",
    requireSignin,
    upload.none(),
    getParkingLogHistory
  );
  app.post(
    "/complexbuilding_cronjob",
    requireSignin,
    upload.none(),
    complexBuilding_cronjob
  );
  app.post(
    "/gettodaycomplexbuildinglogs",
    requireSignin,
    upload.none(),
    getComplexBuildingLogHistory
  );
  app.post(
    "/complex_report_search",
    requireSignin,
    upload.none(),
    complex_report_search
  );

  app.post(
    "/communityhall_cronjob",
    requireSignin,
    upload.none(),
    communityHall_cronjob
  );
  app.post(
    "/commuinity_report_search",
    requireSignin,
    upload.none(),
    commuinity_report_search
  );
  app.post(
    "/gettodaycommunityhalllogs",
    requireSignin,
    upload.none(),
    getCommunityHallLogHistory
  );

  app.post(
    "/residentialhouses_cronjob",
    requireSignin,
    upload.none(),
    residentialHouse_cronjob
  );
  app.post(
    "/residential_report_search",
    requireSignin,
    upload.none(),
    residential_report_search
  );
  app.post(
    "/gettodayresidentialhouselogs",
    requireSignin,
    upload.none(),
    getResidentialHousesLogHistory
  );
};
