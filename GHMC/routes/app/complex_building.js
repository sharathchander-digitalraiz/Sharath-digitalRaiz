var express = require('express');
const app = express();
const cors = require('cors'); 
const multer = require('multer');
const { add_complex_building,getcircleuseraccesscomplex,getallcomplexbuilding,get_complex_name ,editcomplexbuilding,deletecomplexbuilding,updatecomplexbuilding } = require('../../controllers/app/commercial_building');
const { createcommunityhall,upload_communityhall,getallcommunityhall,
  editcommunityhall,updatecommunityhall,deletecommunityhall } = require('../../controllers/app/communityhall'); 
const { createcomplex_build_two,complexbusiness_type,complexcategory_type,getallcomplexbuildingtwo,
  deletecomplexbuildingtwo,editcomplexbuildtwo,updatecomplexbuildtwo,getcomplexdatafloor,upload_build2 }  = require('../../controllers/app/complexbuildtwo'); 
const {validatecommercial_building_two, isRequestvalidatecommercial_building_two,validatecommercial_building_two_update,isRequestvalidatecommercial_building_two_update} = require('../../validators/app/complex_build_two_validators'); 
const { validatecommunity_hall, isRequestvalidatevalidatecommunity_hall} = require('../../validators/app/community_hall'); 

const { complex_search,complex_family_update, commercialflats_details} =  require('../../controllers/app/complexbuildtwo'); 

const upload = require("../../controllers/app/commercial_building").upload; 
const { requireSignin } = require('../../common-middleware'); 
const {validatecommercial_building,isRequestvalidatecommercial_building,validateusercomplexlist,isRequestValidatedusercomplex}=require("../../validators/app/complex_building");

/* Complex UUID */
const {getuuid_complex} = require('../../controllers/app/complexbuildtwo'); 

/* street vendor */
const {createstreetvendor, upload_street_vendor,getallstreetvendor ,  editstreetvendor,updatestreetvendor,
  deletestreetvendor,streatVendor_cronjob,streetVendor_report_search} = require('../../controllers/app/streetvendor'); 
const { validatestreet_vendors, isRequestvalidatestreet_vendors} = require('../../validators/app/street_vendor_validators'); 



/* add parking */
const {createparking, upload_parking, getallparking,editparking,updateparking,deleteparking} = require('../../controllers/app/parking'); 
const { validateparking, isRequestvalidateparking} = require('../../validators/app/parking_validators'); 


/* residential house */
const {createresidential_house, upload_residential_house,alldropdowns,getallresidentialhouse,
  editresidential_house,updateresidential_house,deleteresidential_house,admincreateresidential_house} = require('../../controllers/app/residential_house'); 
const { validateresidential_house, isRequestvalidateresidential_house} = require('../../validators/app/residential_house_validators'); 


/* Open place */
const { createopenplace,uploadopen,getallopenplace ,editopenplace , updateopenplace,deleteopenplace} = require('../../controllers/app/open_place'); 
const {validateopen_place, isRequestvalidateopen_place} = require('../../validators/app/open_place_validators'); 

/* Toilets */
const { createtoilets,uploadtoilets,getalltoilets ,edittoilets , updatetoilets,deletetoilets,Toiletsscan_cronjob,toilets_report_search} = require('../../controllers/app/toilets'); 
const {validatetoilets, isRequestvalidatetoilets} = require('../../validators/app/toiletsvalidators'); 

/* Bus stop */
const { createbusstop,uploadbus_stop,getallbusstop ,editbusstop , updatebusstop,deletebusstop} = require('../../controllers/app/busstop'); 
const {validatebusstop, isRequestvalidatebusstop} = require('../../validators/app/bus_stop_validators');

   /*Man hole */
   const { createmanhole,uploadmanhole, getallmanhole, editmanhole, updatemanhole, deletemanhole} = require('../../controllers/app/manhole'); 
   const { validateman_hole,isRequestvalidateman_hole} = require('../../validators/app/manhole_validators');

/*Man hole tree bus stop */
const {createmanhole_tree,uploadmanhole_tree, getallmanhole_tree, editmanhole_tree,manhole_report_search,
  updatemanhole_tree, deletemanhole_tree } = require('../../controllers/app/manhole_tree_busstop');

  /*Temple */
const { createtemple,uploadtemple, getalltemple, edittemple, updatetemple, deletetemple,Templescan_cronjob,temples_report_search} = require('../../controllers/app/temple'); 
const { validate_temple,isRequestvalidate_temple} = require('../../validators/app/temple_validators'); 

/* Toilets Operations */
const {create_toiletsoperations,upload_toilets_operations} = require('../../controllers/app/toilets_operation'); 
const { validate_operations_toilets, isRequestvalidate_operation_toilets } = require('../../validators/app/operation_toilets_validators')

/* Operation Scan New One */
const {operations_scan} = require('../../controllers/app/operations_scan'); 


/* Common Operatins */
const {createoperations, upload_operations} = require('../../controllers/app/operations');
const {validate_operations, isRequestvalidate_operation} = require('../../validators/app/operation_validator'); 


/* Residency Search */
const {residential_search,residential_family_update} = require('../../controllers/app/residential_house'); 
/* Family Members */
const {family_members} = require('../../controllers/app/residential_house'); 
const {validatefamily, isRequestValidatefamily} = require('../../validators/app/family_validators'); 
/* UUid */
const {getuuid,get_all_family,del_family_member,residential_details} = require('../../controllers/app/residential_house'); 



var router = express.Router(); 
exports.routes = function (app)  
{   
  app.post('/add_complex_building',upload.array("images",5),requireSignin,validatecommercial_building,isRequestvalidatecommercial_building,add_complex_building);
  app.post('/updatecomplexbuilding',upload.array("images",5),requireSignin,updatecomplexbuilding);

 
  app.post('/getcircleuseraccesscomplex',upload.none(),requireSignin,validateusercomplexlist,isRequestValidatedusercomplex,getcircleuseraccesscomplex);  
  app.post('/createcomplex_build_two',upload_build2.array("images",5),requireSignin,validatecommercial_building_two,isRequestvalidatecommercial_building_two,
   createcomplex_build_two); 

    app.post('/getcomplex_dropdown',upload.none(),requireSignin,getcomplexdatafloor); 

   app.post('/getallcomplexbuilding',upload.none(),requireSignin,getallcomplexbuilding);  
   app.post('/get_complex_name',upload.none(),requireSignin,get_complex_name); 
 app.post('/editcomplexbuilding',upload.none(),requireSignin,editcomplexbuilding); 
 app.post('/deletecomplexbuilding',upload.none(),requireSignin,deletecomplexbuilding); 

  app.get('/complexbusiness_type',upload.none(),requireSignin,complexbusiness_type);  
  app.get('/complexcategory_type',upload.none(),requireSignin,complexcategory_type);  
  
  


 
  
  app.get('/getallcomplexbuildingtwo',upload.none(),requireSignin,getallcomplexbuildingtwo); 

  app.post('/deletecomplexbuildingtwo',upload.none(),requireSignin,deletecomplexbuildingtwo);  
  app.post('/editcomplexbuildtwo',upload.none(),requireSignin,editcomplexbuildtwo); 
  app.post('/updatecomplexbuildtwo',upload_build2.array("images",5),requireSignin,validatecommercial_building_two_update,isRequestvalidatecommercial_building_two_update,updatecomplexbuildtwo); 


   /* COMMUNITY HALL */
   app.post('/createcommunityhall',upload_communityhall.array("images",5),requireSignin,validatecommunity_hall,isRequestvalidatevalidatecommunity_hall, createcommunityhall); 
   app.get('/getallcommunityhall',requireSignin,getallcommunityhall); 
   app.post('/admin_getallcommunityhall',requireSignin,getallcommunityhall); 
   
  app.post('/editcommunityhall',upload.none(),requireSignin,editcommunityhall); 
  app.post('/updatecommunityhall',upload_communityhall.array("images",5),requireSignin ,updatecommunityhall); 
  app.post('/deletecommunityhall',upload.none(),requireSignin, deletecommunityhall);    




     /* street vendor */
  app.post('/createstreetvendor',upload_street_vendor.array("images",5),requireSignin,
  validatestreet_vendors,isRequestvalidatestreet_vendors,
   createstreetvendor);  
    app.get('/getallstreetvendor',upload.none(),requireSignin,getallstreetvendor); 
    app.post('/admin_getallstreetvendor',upload.none(),requireSignin,getallstreetvendor); 
  app.post('/editstreetvendor',upload.none(),requireSignin,editstreetvendor); 
  app.post('/updatestreetvendor',upload_street_vendor.array("images",5),requireSignin,updatestreetvendor);
  app.post('/deletestreetvendor',upload.none(),requireSignin,deletestreetvendor); 
  app.post('/streatVendor_cronjob',upload.none(),requireSignin,streatVendor_cronjob); 
  app.post('/streetVendor_report_search',upload.none(),requireSignin,streetVendor_report_search); 



  /* add parking */
  app.post('/createparking',upload_parking.array("images",5),requireSignin,
  validateparking,isRequestvalidateparking,
  createparking); 
    app.get('/getallparking',upload.none(),requireSignin,getallparking)
    app.post('/admin_getallparking',upload.none(),requireSignin,getallparking)
  app.post('/editparking',upload.none(),requireSignin,editparking); 
  app.post('/updateparking',upload_parking.array("images",5), requireSignin,updateparking); 
  app.post('/deleteparking',upload.none(),requireSignin,deleteparking); 



     /* residentail house */
  app.post('/createresidential_house',cors(),upload_residential_house.array("images",5),requireSignin,validateresidential_house,isRequestvalidateresidential_house,createresidential_house); 
  app.post('/admincreateresidential_house',cors(),upload_residential_house.array("images",5),requireSignin,validateresidential_house,isRequestvalidateresidential_house,admincreateresidential_house); 
  app.get('/getallresidentialhouse',upload.none(),requireSignin, getallresidentialhouse); 
  app.post('/admin_getallresidentialhouse',upload.none(),requireSignin, getallresidentialhouse); 
  app.post('/editresidential_house',upload.none(),requireSignin,editresidential_house);
  app.post('/updateresidential_house',upload_residential_house.array("images",5),requireSignin,updateresidential_house);
  app.post('/deleteresidential_house',upload.none(),requireSignin,deleteresidential_house);  
  app.get('/alldropdowns',requireSignin,alldropdowns); 


  /* Open place */
    /* open place */ 
    app.post('/createopenplace',uploadopen.array('images',5),requireSignin,validateopen_place,isRequestvalidateopen_place, createopenplace);  
    app.get('/getallopenplace',upload.none(), requireSignin,getallopenplace);
    app.post('/admin_getallopenplace',upload.none(), requireSignin,getallopenplace);
    app.post('/editopenplace',upload.none(),requireSignin,editopenplace); 
    app.post('/updateopenplace',uploadopen.array('images',5), requireSignin,updateopenplace); 
    app.post('/deleteopenplace',upload.none(),requireSignin,deleteopenplace); 


     /* Toilets */ 
 app.post('/createtoilets',uploadtoilets.array('images',5),requireSignin,validatetoilets,isRequestvalidatetoilets, createtoilets);  
 app.get('/getalltoilets',upload.none(), requireSignin,getalltoilets);
 app.post('/admin_getalltoilets',upload.none(), requireSignin,getalltoilets);
 app.post('/edittoilets',upload.none(),requireSignin,edittoilets); 
 app.post('/updatetoilets',uploadtoilets.array('images',5), requireSignin,updatetoilets);  
 app.post('/deletetoilets',upload.none(),requireSignin,deletetoilets); 
 app.post('/toiletsscan_cronjob',upload.none(),requireSignin,Toiletsscan_cronjob); 
 app.post('/toilets_report_search',upload.none(),requireSignin,toilets_report_search); 


   
   /* Bus stop */ 
   app.post('/createbusstop',uploadbus_stop.array('images',5),requireSignin,validatebusstop,isRequestvalidatebusstop, createbusstop);  
   app.get('/getallbusstop',upload.none(), requireSignin,getallbusstop);
   app.post('/editbusstop',upload.none(),requireSignin,editbusstop); 
   app.post('/updatebusstop',uploadbus_stop.array('images',5), requireSignin,updatebusstop);  
   app.post('/deletebusstop',upload.none(),requireSignin,deletebusstop); 

      /* Man hole */
      app.post('/createmanhole',uploadmanhole.array('images',5),requireSignin,validateman_hole,isRequestvalidateman_hole,createmanhole);
      app.get('/getallmanhole',upload.none(),requireSignin,getallmanhole);
      app.post('/editmanhole',upload.none(),requireSignin,editmanhole);
      app.post('/updatemanhole',uploadmanhole.array('images',5),requireSignin,updatemanhole);
      app.post('/deletemanhole',upload.none(),requireSignin,deletemanhole);  
      app.post('/manhole_report_search',upload.none(),requireSignin,manhole_report_search);  
      
                                                                         
      /* Man hole tree */
      app.post('/createmanhole_tree',uploadmanhole_tree.array('images',5),requireSignin,validateman_hole,isRequestvalidateman_hole,createmanhole_tree);
      app.get('/getallmanhole_tree',upload.none(),requireSignin,getallmanhole_tree);
      app.post('/admin_getallmanhole_tree',upload.none(),requireSignin,getallmanhole_tree);
      app.post('/editmanhole_tree',upload.none(),requireSignin,editmanhole_tree);  
      app.post('/updatemanhole_tree',uploadmanhole_tree.array('images',5),requireSignin,updatemanhole_tree);
      app.post('/deletemanhole_tree',upload.none(),requireSignin,deletemanhole_tree);


        /* Temple */
        app.post('/createtemple',uploadtemple.array('images',5),requireSignin,validate_temple,isRequestvalidate_temple,createtemple);
        app.get('/getalltemple',upload.none(),requireSignin,getalltemple);
        app.post('/admin_getalltemple',upload.none(),requireSignin,getalltemple);
        app.post('/edittemple',upload.none(),requireSignin,edittemple);  
        app.post('/updatetemple',uploadtemple.array('images',5),requireSignin,updatetemple);
        app.post('/deletetemple',upload.none(),requireSignin,deletetemple); 
        app.post('/templescan_cronjob',upload.none(),requireSignin,Templescan_cronjob); 
        app.post('/temples_report_search',upload.none(),requireSignin,temples_report_search); 

        /* Toilet Operation */
  app.post('/create_toiletsoperations',requireSignin,upload_toilets_operations.array('images',5), validate_operations_toilets, isRequestvalidate_operation_toilets ,create_toiletsoperations);
        
   /* Operations New Scan */
   app.post('/operations_scan',upload.none(),requireSignin,operations_scan); 

    /* Operation */
  app.post('/createoperations',requireSignin,upload_operations.array('images',5),validate_operations, isRequestvalidate_operation,createoperations);
  
  /* Residency Search */
  app.post('/residential_search',requireSignin, upload.none(),residential_search); 

   /* Family Members */
   app.post('/family_members',upload.none(),requireSignin,family_members); 

   /* UUID */
   app.get('/getuuid',upload.none(),getuuid); 
   
   /* Residential Family Update */ 
   app.post('/residential_family_update',requireSignin,upload.none(),residential_family_update); 

   /* Complex Building Two */
   app.get('/getuuid_complex',upload.none(),getuuid_complex); 

   app.post('/complex_search',upload.none(),requireSignin,complex_search); 
   app.post('/commercialflats_details',upload.none(),requireSignin,commercialflats_details )

   app.post('/complex_family_update',upload.none(),requireSignin,complex_family_update); 

   app.post('/get_all_family',requireSignin,upload.none(),get_all_family); 

   app.post('/del_family_member',requireSignin,upload.none(),del_family_member);

   app.post('/residential_details',requireSignin,upload.none(),residential_details); 
}       