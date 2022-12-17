const express = require('express');

/* SIGN IN Require */
const { requireSignin } = require('../../common-middleware/index'); 


/*Admin Dashboard */
const {admin_dashboard_all_data,upload,culvert_issue_admin_dash ,admin_gvp_bep_dash} = require('../../controllers/dashboard/dashboard_api'); 
const {get_reports_vehicle_attendance,get_reports_search_vehicle_attendance,} = require('../../controllers/dashboard/reports_admin_api'); 
const {culvert_issue_report,culvert_issue_report_search} = require('../../controllers/dashboard/culvert_issue_report'); 

const {gettransfer_station_report,gettransfer_station_search_report} = require('../../controllers/admin/transfer_station'); 
const {validatetransfer_station,isRequestValidatedtransfer_station} = require('../../validators/transfer_station'); 

/* Operations Dashboard */
const {operations_report} = require('../../controllers/dashboard/operations_reports'); 


/* Vehicle Attendance report */
const {transport_vehicle_attendance,transport_vehicle_attendance_search} = require('../../controllers/dashboard/transport_vehicle_attendance_reports'); 


var router = express.Router();          
exports.routes = function (app)        
{ 
    /* Dashboard */
    app.post('/admin/api/admin_dashboard_all_data',requireSignin,upload.none(),admin_dashboard_all_data); 
    app.post('/admin/api/culvert_issue_admin_dash',requireSignin,upload.none(),culvert_issue_admin_dash);
    app.post('/admin/api/admin_gvp_bep_dash',requireSignin,upload.none(),admin_gvp_bep_dash); 


                                                        /* Reports */
    /* Vehicle reports */
    app.post('/admin/api/get_reports_vehicle_attendance',requireSignin,upload.none(),get_reports_vehicle_attendance); 
    app.post('/admin/api/get_reports_search_vehicle_attendance',requireSignin,upload.none(),get_reports_search_vehicle_attendance); 


        /**Transfer station Report*/
        app.post('/admin/api/gettransfer_station_report',requireSignin,upload.none(),gettransfer_station_report); 
        app.post('/admin/api/gettransfer_station_search_report',requireSignin,upload.none(),validatetransfer_station,isRequestValidatedtransfer_station,gettransfer_station_search_report); 
     
    /* Culvert issue reports */
    app.post('/admin/api/culvert_issue_report',requireSignin,upload.none(),culvert_issue_report);   
    app.post('/admin/api/culvert_issue_report_search',requireSignin,upload.none(),culvert_issue_report_search);   

        /* Operation reports */
        app.post('/admin/api/operations_report',requireSignin,upload.none(),operations_report); 
    
      /* Transport Vehicle Attendace */
      app.post('/admin/api/transport_vehicle_attendance',requireSignin,upload.none(),transport_vehicle_attendance); 
      app.post('/admin/api/transport_vehicle_attendance_search',requireSignin,upload.none(),transport_vehicle_attendance_search); 
     
   
}