const User               = require('../../model/users'); 
const Department         = require('../../model/department'); 
const Vehicle_attendance = require('../../model/vehicles_attandance'); 
const Gvepbeptrips      = require('../../model/garbagetrips'); 
const Gvpbep            = require('../../model/gvpbep'); 
const Complex_building  = require('../../model/complex_building'); 
const Operations        = require('../../model/operations'); 
const Residential_house = require('../../model/residential_house'); 
const Street_vendor     = require('../../model/streetvendor'); 
const Community_hall    = require('../../model/communityhall'); 
const Toilets           = require('../../model/toilets'); 
const Toiletsoperation  = require('../../model/toilets_operations');
const Parking           = require('../../model/parking'); 
const Openplace         = require('../../model/openplace'); 
const Manhole_tree      = require('../../model/man_hole_tree_busstop');
const Temple            = require('../../model/temple'); 
const Useraccess        = require('../../model/useraccess');
const Zones             = require('../../model/zones'); 
const Circles           = require('../../model/circles');
const Ward              = require('../../model/wards');
const Landmark          = require('../../model/landmarks');
const Area              = require('../../model/area'); 
const Vehicles          = require('../../model/vehicles'); 
const download          = require('download');
const excel = require("exceljs");
const url               = 'http://13.233.105.84:2000/'; 
var fs   = require('fs');
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;  
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name'); 
 

exports.all_appmodules_dashboard = async(req,res)=>{ 
        const { user_id,tenent_id } = req.body; 
        console.log(req.body); 
    
        if(user_id  == '' || user_id == undefined){
            return res.status(200).send({login:true,success:false,message:'User id is required'}); 
        }

        if(tenent_id == '' || tenent_id == undefined){
            return res.status(200).send({login:true,success:false,message:'Tenent id is required'}); 
        }
 
        let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
        let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});

        let current_datetime = new Date(); 
        let s = new String(current_datetime.getDate()); 
        let cd; 	
        if(s.length == 1){
            cd = '0'+s; 
        }else{
            cd = current_datetime.getDate(); 
        } 
        let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;
//   let formatted_date =   '2021-12-05';

if(role_data.name == 'Admin'){
    let final_array = []; 

    let sat_attend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    let sat_notattend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    final_array.push({name:'Sat Vehicle',attend:sat_attend,notattend:sat_notattend,link:url+'download_excle_dashboard/Sat_Vehicle/'+user_id+'/'+tenent_id})


    let transport_attend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    let transport_notattend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    final_array.push({name:'Transport Vehicle',attend:transport_attend,notattend:transport_notattend,link:url+'download_excle_dashboard/Transport_Vehicle/'+user_id+'/'+tenent_id})


    let gvp_attend = await Gvepbeptrips.find({date:formatted_date,type:{$in : ['Gvp','GVP','Bep','BEP']},tenent_id:tenent_id  }).countDocuments();
    let gvp_total = await Gvpbep.find({tenent_id:tenent_id}).countDocuments();
    final_array.push({name:'Gvpbep',attend: gvp_attend,notattend:gvp_total - gvp_attend,link:url+'download_excle_dashboard/Gvpbep/'+user_id+'/'+tenent_id}); 
    

    let total_complex = await Complex_building.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let complex_attend =  await Operations.find({date:formatted_date,db_type:'comercial_buildings',tenent_id:ObjectId(tenent_id)}).countDocuments();
    final_array.push({name:'Comercial Building',attend:complex_attend, notattend:total_complex-complex_attend,link:''});
    

    let total_residential = await Residential_house.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let residential_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'residential_houses'}).countDocuments();
    final_array.push({name:'Residential House',attend:residential_attend ,notattend:total_residential-residential_attend,link:''});
 

    let total_street = await Street_vendor.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let street_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'streetvendors'}).countDocuments();
    final_array.push({name:'Street vendor',attend:street_attend, notattend:total_street-street_attend,link:''}); 

    let total_communityhall = await Community_hall.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let community_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'communityhalls'}).countDocuments();
    final_array.push({name:'Community hall',attend:community_attend ,notattend:total_communityhall-community_attend,link:''});
   
    let total_toilets = await Toilets.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let toilets_attend =  await Toiletsoperation.find({tenent_id:ObjectId(tenent_id),date:formatted_date}).countDocuments();
    final_array.push({name:'Toilets',attend: toilets_attend,notattend:total_toilets-toilets_attend,link:''});


    let total_parking = await Parking.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let parking_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'parkings'}).countDocuments();
    final_array.push({name:'Parking',attend: parking_attend,notattend:total_parking-parking_attend,link:''});

    let total_manhole = await Manhole_tree.find({tenent_id:ObjectId(tenent_id),type:'Man hole'}).countDocuments(); 
    let manhole_data  = await Manhole_tree.aggregate([
        {
            "$match":{ type : 'Man hole',tenent_id:ObjectId(tenent_id)}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])
  //  console.log(total_manhole); 
   // console.log(manhole_data.length); 
   
    final_array.push({name:'Man hole',attend:manhole_data.length ,notattend:total_manhole-manhole_data.length,link:''});

    let total_tree = await Manhole_tree.find({tenent_id:ObjectId(tenent_id),type:'Tree'}).countDocuments(); 
    let tree_data  = await Manhole_tree.aggregate([
        {
            "$match":{ type : 'Tree',tenent_id:ObjectId(tenent_id)}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    
    final_array.push({name:'Tree',attend:tree_data.length ,notattend:total_tree-tree_data.length,link:''});

    let total_busstop = await Manhole_tree.find({tenent_id:ObjectId(tenent_id),type:'Bus Stop'}).countDocuments(); 
    let busstop_data  = await Manhole_tree.aggregate([
        {
            "$match":{ type : 'Bus Stop',tenent_id:ObjectId(tenent_id)}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    final_array.push({name:'Bus Stop',attend:busstop_data.length ,notattend:total_busstop-busstop_data.length,link:''});


    let total_temple = await Temple.find({tenent_id:ObjectId(tenent_id),type:'Temple'}).countDocuments(); 
    let temple_data  = await Temple.aggregate([
        {
            "$match":{ type : 'Temple',tenent_id:ObjectId(tenent_id)}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },    
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    final_array.push({name:'Temple',attend: temple_data.length,notattend:total_temple-temple_data.length,link:''});

    let total_church = await Temple.find({tenent_id:ObjectId(tenent_id),type:'Church'}).countDocuments(); 
    let church_data  = await Temple.aggregate([
        {
            "$match":{ type : 'Church',tenent_id:ObjectId(tenent_id)}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    final_array.push({name:'Church',attend: church_data.length,notattend:total_church-church_data.length,link:''});


    let total_masjid = await Temple.find({tenent_id:ObjectId(tenent_id),type:'Masjid'}).countDocuments(); 
    let masjid_data  = await Temple.aggregate([
        {
            "$match":{ type : 'Masjid',tenent_id:ObjectId(tenent_id)}
        }, 
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])
   
    final_array.push({name:'Masjid',attend:masjid_data.length , notattend:total_masjid-masjid_data.length,link:''});

    return res.status(200).send({login:true,success:true,data: final_array}); 
   }else{

    const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
  //  console.log(access_data); 
            let acc_zones = [];
            let acc_circles = []; 
            let acc_wards = []; 
            let acc_areas = []; 
            let acc_landmark = []; 
            acc_zones = access_data['zones'].map((val)=>{
                return ObjectId(val)
            })
            acc_circles = access_data['circles'].map((val)=>{
                return ObjectId(val)
            })
            acc_wards = access_data['ward'].map((val)=>{
                return ObjectId(val)
            })
            acc_areas = access_data['areas'].map((val)=>{
                return ObjectId(val)
            })
            acc_landmark = access_data['landmarks'].map((val)=>{
                return ObjectId(val)
            })
          //  console.log();
            let newobject = {}; 
           // newobject.date = '2021-11-23'; 
            newobject.zones_id = {$in: acc_zones};
            newobject.circles_id = {$in: acc_circles};
            newobject.ward_id = {$in: acc_wards};
            newobject.areas_id = {$in: acc_areas};
            newobject.landmark_id = {$in: acc_landmark}; 

    let final_array = []; 

    let sat_attend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1 }).countDocuments(); 
    let sat_notattend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0 }).countDocuments(); 
    final_array.push({name:'Sat Vehicle',attend:sat_attend,notattend:sat_notattend,link:url+'download_excle_dashboard/Sat_Vehicle/'+user_id+'/'+tenent_id})


    let transport_attend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1 }).countDocuments(); 
    let transport_notattend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0 }).countDocuments(); 
    final_array.push({name:'Transport Vehicle',attend:transport_attend,notattend:transport_notattend,link:url+'download_excle_dashboard/Transport_Vehicle/'+user_id+'/'+tenent_id})


    let gvp_attend = await Gvepbeptrips.find({zone_id:{$in: acc_zones},circle_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,type:{$in : ['Gvp','GVP','Bep','BEP']} }).countDocuments();
    let gvp_total = await Gvpbep.find({zone_id:{$in: acc_zones},circle_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}}).countDocuments();
    final_array.push({name:'Gvpbep',attend: gvp_attend,notattend:gvp_total - gvp_attend,link:url+'download_excle_dashboard/Gvpbep/'+user_id+'/'+tenent_id}); 
    

    let total_complex = await Complex_building.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
    let complex_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date,db_type:'comercial_buildings'}).countDocuments();
    final_array.push({name:'Comercial Building',attend:complex_attend, notattend:total_complex-complex_attend,link:''});
    

    let total_residential = await Residential_house.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
    let residential_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},date:formatted_date,db_type:'residential_houses'}).countDocuments();
    final_array.push({name:'Residential House',attend:residential_attend ,notattend:total_residential-residential_attend,link:''});
 

    let total_street = await Street_vendor.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
    let street_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},date:formatted_date,db_type:'streetvendors'}).countDocuments();
    final_array.push({name:'Street vendor',attend:street_attend, notattend:total_street-street_attend,link:''}); 

    let total_communityhall = await Community_hall.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
    let community_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},date:formatted_date,db_type:'communityhalls'}).countDocuments();
    final_array.push({name:'Community hall',attend:community_attend ,notattend:total_communityhall-community_attend,link:''});
   
    let total_toilets = await Toilets.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
    let toilets_attend =  await Toiletsoperation.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date}).countDocuments();
    final_array.push({name:'Toilets',attend: toilets_attend,notattend:total_toilets-toilets_attend,link:''});


    let total_parking = await Parking.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards} ,area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
    let parking_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'parkings'}).countDocuments();
    final_array.push({name:'Parking',attend: parking_attend,notattend:total_parking-parking_attend,link:''});

    let total_manhole = await Manhole_tree.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}  ,type:'Man hole'}).countDocuments(); 
    let manhole_data  = await Manhole_tree.aggregate([
        {
            "$match":{ type : 'Man hole',zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])
  //  console.log(total_manhole); 
   // console.log(manhole_data.length); 
   
    final_array.push({name:'Man hole',attend:manhole_data.length ,notattend:total_manhole-manhole_data.length,link:''});

    let total_tree = await Manhole_tree.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Tree'}).countDocuments(); 
    let tree_data  = await Manhole_tree.aggregate([
        {
            "$match":{ type : 'Tree',zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    
    final_array.push({name:'Tree',attend:tree_data.length ,notattend:total_tree-tree_data.length,link:''});

    let total_busstop = await Manhole_tree.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Bus Stop'}).countDocuments(); 
    let busstop_data  = await Manhole_tree.aggregate([
        {
            "$match":{ type : 'Bus Stop',zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    final_array.push({name:'Bus Stop',attend:busstop_data.length ,notattend:total_busstop-busstop_data.length,link:''});


    let total_temple = await Temple.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Temple'}).countDocuments(); 
    let temple_data  = await Temple.aggregate([
        {
            "$match":{ type : 'Temple',zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },    
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    final_array.push({name:'Temple',attend: temple_data.length,notattend:total_temple-temple_data.length,link:''});

    let total_church = await Temple.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Church'}).countDocuments(); 
    let church_data  = await Temple.aggregate([
        {
            "$match":{ type : 'Church',zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}}
        },
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])

    final_array.push({name:'Church',attend: church_data.length,notattend:total_church-church_data.length,link:''});


    let total_masjid = await Temple.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Masjid'}).countDocuments(); 
    let masjid_data  = await Temple.aggregate([
        {
            "$match":{ type : 'Masjid',zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}}
        }, 
        {
            $lookup:{
                from: "operations",       // other table name
                localField: "_id",   // name of users table field
                foreignField: "collection_id", // name of userinfo table field
                as: "info_manhole"         // alias for userinfo table
            }   
        },  
        {   $unwind:"$info_manhole" },   
        {"$match": {"info_manhole.date":formatted_date}}, 
       
    ])
   
    final_array.push({name:'Masjid',attend:masjid_data.length , notattend:total_masjid-masjid_data.length,link:''});

    return res.status(200).send({login:true,success:true,data: final_array}); 
   }


}


exports.all_appmodules_dashboard_search = async(req,res)=>{
    console.log('search'); 
    console.log(req.body); 
       const {user_id,zones_id,circles_id,area_id,ward_id,module_type,tenent_id,reportrange} = req.body; 
      


       
       if(module_type == '' || module_type == undefined){
           return res.status(400).send({login:true,success:false,message:'Select module type'})
       }
       let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
       let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
       let  access_data;
       let acc_zones = [];
       let acc_circles = [];
       let acc_wards = [];
       let acc_areas = [];
       let acc_landmark = []; 
       let zones_details = []; 
       let circle_details = [];
       let area_details = [];
       let ward_details = []; 



       if(role_data.name != 'Admin'){
        access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
       // console.log(access_data); 
              if(zones_id == 'All'){   
                acc_zones = access_data['zones'].map((val)=>{  
                    return ObjectId(val)  
                }) 
               }else if(zones_id != '' && zones_id != undefined && zones_id != 'All'){
                acc_zones = [ObjectId(zones_id)]; 
               }
               
               if(circles_id == 'All'){
                acc_circles = access_data['circles'].map((val)=>{ 
                    return ObjectId(val)
                })
                }else if(circles_id != '' && circles_id != undefined && circles_id != 'All'){
                    acc_circles = [ObjectId(circles_id)];
                }

                if(ward_id == 'All'){
                acc_wards = access_data['ward'].map((val)=>{  
                    return ObjectId(val) 
                })
               }else if(ward_id != '' && ward_id != undefined && ward_id != 'All'){
                acc_wards = [ObjectId(ward_id)];
               }
               
               if(area_id == 'All'){
                acc_areas = access_data['areas'].map((val)=>{  
                    return ObjectId(val)
                })
               }else if(area_id != '' && area_id != undefined && area_id != 'All'){
                acc_areas = [ObjectId(area_id)];
               }

                acc_landmark = access_data['landmarks'].map((val)=>{
                    return ObjectId(val)
                }) 
               // console.log(access_data)  
       }else{ 
           if(zones_id == 'All'){  
                zones_details = await Zones.find({tenent_id:tenent_id},{_id:1}).exec(); 
                acc_zones     = zones_details; 
            //    console.log(zones_details)
           }else if(zones_id != '' && zones_id != undefined && zones_id != 'All'){
            acc_zones = [ObjectId(zones_id)]; 
           }
          
           if(circles_id == 'All'){
                circle_details = await Circles.find({tenent_id:tenent_id},{_id:1}).exec(); 
                acc_circles    = circle_details; 
           }else if(circles_id.length != '' && circles_id != undefined && circles_id != 'All'){
              
                    acc_circles = [ObjectId(circles_id)];
                }
               
           if(area_id == 'All'){
                area_details = await Area.find({tenent_id:tenent_id},{_id:1}).exec();
                acc_areas    = area_details; 
           }else if(area_id != '' && area_id != undefined && area_id != 'All'){
            acc_areas = [ObjectId(area_id)];
               }


           if(ward_id == 'All'){  
                ward_details = await Ward.find({tenent_id:tenent_id},{_id:1}).exec(); 
                acc_wards = acc_landmark;  
           }else if(ward_id != '' && ward_id != undefined && ward_id != 'All'){
            acc_wards = [ObjectId(ward_id)]; 
               } 
       }
      
     const addDays = (date, days = 1) => { 
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
      
      const dateRange = (start, end, range = []) => {
        if (start > end) return range;
        const next = addDays(start, 1);
        return dateRange(next, end, [...range, start]);
      };
        let newDate = reportrange.split("/");
        console.log(newDate);  
        const current_datetime = new Date(newDate[0]);
        let s = new String(current_datetime.getDate()); 
        let cd; 	
        if(s.length == 1){ 
            cd = '0'+s; 
        }else{
            cd = current_datetime.getDate(); 
        } 
        let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;

        const future_datetime = new Date(newDate[1]);
        let s1 = new String(future_datetime.getDate()); 
        let cd1; 	
        if(s1.length == 1){ 
            cd1 = '0'+s1; 
        }else{
            cd1 = future_datetime.getDate(); 
        } 
        let formatted_date_future =   future_datetime.getFullYear() + "-" + (future_datetime.getMonth() + 1)+ "-" +cd1;


     const range = dateRange(new Date(formatted_date), new Date(formatted_date_future));
     let arrDate = range.map(date => date.toISOString().slice(0, 10));   
     let dates_search = arrDate; 
    //  console.log(dates_search); 

     if(dates_search.length == 0){
        let formatted_date = dates_search[0];      
   //    let final_array = [];   

     
        
       if(module_type == 'Sat Vehicle'){
             /* Sat attendance present */   
        //     console.log('sat')
       let sat_attendance_1 = {vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,date:formatted_date }; 
       if(zones_id != '' ){
           if(zones_id == 'All'){
            
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                sat_attendance_1['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                sat_attendance_1['zones_id'] = {$in:acc_zones}
                } 
            }
           }else{
                sat_attendance_1['zones_id'] = ObjectId(zones_id)
           }
           
       }
       
       if(circles_id != '' ){
          
            if(circles_id == 'All'){
                if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                sat_attendance_1['circles_id'] = {$in:circle_details}
                }
                }else{
                    if(acc_circles.length != 0){
                    sat_attendance_1['circles_id'] = {$in:acc_circles}
                    }
                }
            }else{
            sat_attendance_1['circles_id'] = ObjectId(circles_id)
            }
       }
       
       if(area_id != '' ){
            if(area_id == 'All'){
                if(role_data.name == 'Admin'){
                        if(area_details.length != 0){
                        sat_attendance_1['landmark_id'] =  {$in:area_details}
                        }
                }else{ 
                        if(acc_areas.length != 0){
                        sat_attendance_1['landmark_id'] = {$in:acc_areas}
                        }
                }
            }else{
                sat_attendance_1['landmark_id'] = ObjectId(area_id)
            }
       }

       if(ward_id != ''){
           if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    sat_attendance_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                    sat_attendance_1['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            sat_attendance_1['ward_id'] = ObjectId(ward_id)
           }
       }
        
        /* Sat attendance abscent */
       let sat_attendance_0 = {vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,date:formatted_date }; 
      
       if(zones_id != ''){
        if(zones_id == 'All'){
           
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                sat_attendance_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                sat_attendance_0['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            sat_attendance_0['zones_id'] = ObjectId(zones_id)
           }
           
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
            if(circle_details.length != 0){ 
            sat_attendance_0['circles_id'] = {$in:circle_details}
            }
            }else{
                if(acc_circles.length != 0){
                sat_attendance_0['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            sat_attendance_0['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    sat_attendance_0['landmark_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                sat_attendance_0['landmark_id'] = {$in:acc_areas}
                }
            }
        }else{
            sat_attendance_0['landmark_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    sat_attendance_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                sat_attendance_0['ward_id'] = {$in:acc_wards}
                }
            }
           }else{
            sat_attendance_0['ward_id'] = ObjectId(ward_id)
           }
      
       }
      
       let sat_attend = await Vehicle_attendance.find(sat_attendance_1).countDocuments(); 
       let sat_notattend = await Vehicle_attendance.find(sat_attendance_0).countDocuments(); 
    //   console.log('sing')
      // final_array.push({name:'Sat Vehicle',attend:sat_attend,notattend:sat_notattend})
         return res.status(200).send({login:true,message:true,data:[{name:'Sat Vehicle',attend:sat_attend,notattend:sat_notattend}]})
       }

       
      

       if(module_type == 'Transport Vehicle'){
        //   console.log('Transport vehicle')
            /* Transport attendance */
        //    console.log(formatted_date); 
       let transport_attendance_1 = {vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,date:formatted_date }
       if(zones_id != ''){
        if(zones_id == 'All'){
           
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                transport_attendance_1['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                transport_attendance_1['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            transport_attendance_1['zones_id'] = ObjectId(zones_id)
           }
        
       }
       
       if(circles_id != ''){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
            if(circle_details.length != 0){ 
            transport_attendance_1['circles_id'] = {$in:circle_details}
            }
            }else{
                if(acc_circles.length != 0){
                transport_attendance_1['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            transport_attendance_1['circles_id'] = ObjectId(circles_id)
        }
      
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    transport_attendance_1['landmark_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                transport_attendance_1['landmark_id'] = {$in:acc_areas}
                }
            }
        }else{
            transport_attendance_1['landmark_id'] = ObjectId(area_id)
        }
      
       }  

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    transport_attendance_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                transport_attendance_1['ward_id'] = {$in:acc_wards}
                }
            }
           }else{
            transport_attendance_1['ward_id'] = ObjectId(ward_id)
           }
      
       }

       let transport_attendance_0 = {vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,date:formatted_date }
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                transport_attendance_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                transport_attendance_0['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            transport_attendance_0['zones_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
            if(circle_details.length != 0){
            transport_attendance_0['circles_id'] = {$in:circle_details}
            }
            }else{
                if(acc_circles.length != 0){
                transport_attendance_0['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            transport_attendance_0['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    transport_attendance_0['landmark_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                transport_attendance_0['landmark_id'] = {$in:acc_areas}
                }
            }
        }else{
            transport_attendance_0['landmark_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    transport_attendance_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                transport_attendance_0['ward_id'] = {$in:acc_wards}
                }
            }
           }else{
            transport_attendance_0['ward_id'] = ObjectId(ward_id)
           }
      
       } 
       let transport_attend = await Vehicle_attendance.find(transport_attendance_1).countDocuments(); 
       let transport_notattend = await Vehicle_attendance.find(transport_attendance_0).countDocuments(); 
       return res.status(200).send({login:true,status:true,data:[{name:'Transport Vehicle',attend:transport_attend,notattend:transport_notattend}]})
      // final_array.push({name:'Transport Vehicle',attend:transport_attend,notattend:transport_notattend})
       }
       
     

       if(module_type == 'GVP/BEP'){
             /* Gvpbep */
       let garbage_obj_1 = {type:{$in : ['Gvp','GVP','Bep','BEP']},date:formatted_date  } 
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                garbage_obj_1['zone_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                garbage_obj_1['zone_id'] = {$in:acc_zones}
                }
            }
           }else{
            garbage_obj_1['zone_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                garbage_obj_1['circle_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                garbage_obj_1['circle_id'] = {$in:acc_circles}
                } 
            }
        }else{
            garbage_obj_1['circle_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != ''){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    garbage_obj_1['landmark_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                garbage_obj_1['landmark_id'] = {$in:acc_areas}
                } 
            }
        }else{
            garbage_obj_1['landmark_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    garbage_obj_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                garbage_obj_1['ward_id'] = {$in:acc_wards}
                }
            }
           }else{
            garbage_obj_1['ward_id'] = ObjectId(ward_id)
           }
      
       }

   
       let garbage_obj_0 = { }
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                garbage_obj_0['zone_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                garbage_obj_0['zone_id'] = {$in:acc_zones}
                }
            }
           }else{
            garbage_obj_0['zone_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){ 
                    garbage_obj_0['circle_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                garbage_obj_0['circle_id'] = {$in:acc_circles}
                }
            } 
        }else{
            garbage_obj_0['circle_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    garbage_obj_0['area_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                garbage_obj_0['area_id'] = {$in:acc_areas}
                }
            }
        }else{
            garbage_obj_0['area_id'] = ObjectId(area_id)
        }
     
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    garbage_obj_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                garbage_obj_0['ward_id'] = {$in:acc_wards}
                }
            }
           }else{ 
            garbage_obj_0['ward_id'] = ObjectId(ward_id)
           }
     
       }

       let gvp_attend = await Gvepbeptrips.find(garbage_obj_1).countDocuments();
       let gvp_total = await Gvpbep.find(garbage_obj_0).countDocuments();
       return res.status(200).send({login:true,status:true,data: [{name:'GVP/BEP',attend: gvp_attend,notattend:gvp_total - gvp_attend}]})
     //  final_array.push({name:'Gvpbep',attend: gvp_attend,notattend:gvp_total - gvp_attend}); 
       }
   
      
       let complex_building_obj_1 = {}; 
       if(zones_id != '' ){
        if(zones_id == 'All'){ 
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                complex_building_obj_1['zones_id'] = {$in:zones_details}
                } 
            }else{ 
                if(acc_zones.length != 0){
                complex_building_obj_1['zones_id'] = {$in:acc_zones}
                } 
            }
           }else{
            complex_building_obj_1['zones_id'] = ObjectId(zones_id)
           }
      
       }
       
       if(circles_id != ''){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    complex_building_obj_1['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                complex_building_obj_1['circles_id'] = {$in:acc_circles}
                }
            }   
        }else{
            complex_building_obj_1['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    complex_building_obj_1['area_id'] =  {$in:area_details}
                    } 
            }else{ 
                if(acc_areas.length != 0){
                complex_building_obj_1['area_id'] = {$in:acc_areas}
                } 
            }
        }else{
            complex_building_obj_1['area_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    complex_building_obj_1['ward_id'] = {$in:ward_details}
                    } 
            }else{
                if(acc_wards.length != 0){
                complex_building_obj_1['ward_id'] = {$in:acc_wards}
                } 
            }
           }else{
            complex_building_obj_1['ward_id'] = ObjectId(ward_id)
           }
       
       }

       if(module_type == 'Complex & Building'){ 
            /* Complex building */
       

       let complex_building_obj_0 = {db_type:'comercial_buildings'}; 
       complex_building_obj_0['date'] = formatted_date; 
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                complex_building_obj_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                complex_building_obj_0['zones_id'] = {$in:acc_zones}
                } 
            }
           }else{
            complex_building_obj_0['zones_id'] = ObjectId(zones_id)
           }
        
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    complex_building_obj_0['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                complex_building_obj_0['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            complex_building_obj_0['circles_id'] = ObjectId(circles_id)
        }
      
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    complex_building_obj_0['area_id'] =  {$in:area_details}
                    } 
            }else{ 
                if(acc_areas.length != 0){
                complex_building_obj_0['area_id'] = {$in:acc_areas}
                } 
            }
        }else{
            complex_building_obj_0['area_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    complex_building_obj_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                complex_building_obj_0['ward_id'] = {$in:acc_wards}
                } 
            }
           }else{
            complex_building_obj_0['ward_id'] = ObjectId(ward_id)
           }
       
       }

       let total_complex = await Complex_building.find(complex_building_obj_1).countDocuments(); 
       let complex_attend =  await Operations.find(complex_building_obj_0).countDocuments();
       return res.status(200).send({login:true,status:true,data:[{name:'Complex & Building',attend:complex_attend, notattend:total_complex-complex_attend}]})
      // final_array.push({name:'Comercial Building',attend:complex_attend, notattend:total_complex-complex_attend});
       }
   

       
       /* Residential House */
       if(module_type == 'Residential/house'){ 
       let Residential_house_0 = {db_type:'residential_houses'};
       Residential_house_0['date'] = formatted_date;
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){ 
                Residential_house_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                Residential_house_0['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            Residential_house_0['zones_id'] = ObjectId(zones_id)
           }
     
       }
       
       if(circles_id != ''){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                Residential_house_0['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                Residential_house_0['circles_id'] = {$in:acc_circles}
                } 
            }
        }else{
            Residential_house_0['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != ''){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    Residential_house_0['area_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                Residential_house_0['area_id'] = {$in:acc_areas}
                }
            } 
        }else{
            Residential_house_0['area_id'] = ObjectId(area_id)
        }
     
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){ 
                    Residential_house_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                Residential_house_0['ward_id'] = {$in:acc_wards}
                } 
            }
           }else{
            Residential_house_0['ward_id'] = ObjectId(ward_id)
           }
      
       }
      
       let total_residential = await Residential_house.find(complex_building_obj_1).countDocuments(); 
       let residential_attend =  await Operations.find(Residential_house_0).countDocuments();
       return res.status(200).send({login:true,status:true,data: [{name:'Residential/house',attend:residential_attend ,notattend:total_residential-residential_attend}]})
       // final_array.push({name:'Residential House',attend:residential_attend ,notattend:total_residential-residential_attend});
       }
   
      

       if(module_type == 'Street Vendor'){ 

         /* Street Vendor */
       let street_vendor_0 ={db_type:'streetvendors'}; 
       street_vendor_0['date'] = formatted_date;
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){ 
                street_vendor_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                street_vendor_0['zones_id'] = {$in:acc_zones}
                } 
            }
           }else{
            street_vendor_0['zones_id'] = ObjectId(zones_id)
           }
      
       }
       
       if(circles_id != ''){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                   street_vendor_0['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                street_vendor_0['circles_id'] = {$in:acc_circles}
                } 
            }
        }else{
            street_vendor_0['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    street_vendor_0['area_id'] =  {$in:area_details}
                    } 
            }else{ 
                if(acc_areas.length != 0){
                street_vendor_0['area_id'] = {$in:acc_areas}
                }
            }
        }else{
            street_vendor_0['area_id'] = ObjectId(area_id)
        }
     
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                    street_vendor_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                street_vendor_0['ward_id'] = {$in:acc_wards}
                } 
            }
           }else{
            street_vendor_0['ward_id'] = ObjectId(ward_id)
           }
       
       }

       let total_street = await Street_vendor.find({complex_building_obj_1}).countDocuments(); 
       let street_attend =  await Operations.find(street_vendor_0).countDocuments();
       return res.status(200).send({login:true,status:true,data: [{name:'Street Vendor',attend:street_attend, notattend:total_street-street_attend}]})
      // final_array.push({name:'Street vendor',attend:street_attend, notattend:total_street-street_attend}); 
       }

     

       if(module_type == 'Community Hall'){ 
             /* Community Hall */
       let community_hal_obj_0 ={db_type:'communityhalls'};
       community_hal_obj_0['date'] = formatted_date;
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){ 
                community_hal_obj_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                community_hal_obj_0['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            community_hal_obj_0['zones_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    community_hal_obj_0['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                community_hal_obj_0['circles_id'] = {$in:acc_circles}
                } 
            }
        }else{
            community_hal_obj_0['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    community_hal_obj_0['landmark_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                community_hal_obj_0['landmark_id'] = {$in:acc_areas}
                } 
            }
        }else{
            community_hal_obj_0['landmark_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){ 
                    community_hal_obj_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                if(acc_wards.length != 0){
                community_hal_obj_0['ward_id'] = {$in:acc_wards}
                } 
            }
           }else{
            community_hal_obj_0['ward_id'] = ObjectId(ward_id)
           }
       
       }

       let total_communityhall = await Community_hall.find(complex_building_obj_1).countDocuments(); 
       let community_attend =  await Operations.find(community_hal_obj_0).countDocuments();
       return res.status(200).send({login:true,success:true,data:[{name:'Community Hall',attend:community_attend ,notattend:total_communityhall-community_attend}]})
      // final_array.push({name:'Community hall',attend:community_attend ,notattend:total_communityhall-community_attend});
       }

       /* Toilets */
       if(module_type == 'Toilet'){  
        let toilets_obj_1 = {}; 
        toilets_obj_1['date'] = formatted_date; 
        if(zones_id != '' ){
         if(zones_id == 'All'){ 
             if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                   toilets_obj_1['zones_id'] = {$in:zones_details}
                }
             }else{ 
                 if(acc_zones.length != 0){
                     toilets_obj_1['zones_id'] = {$in:acc_zones}
                 }
             }
            }else{
                toilets_obj_1['zones_id'] = ObjectId(zones_id)
            }
       
        }
        
        if(circles_id != ''){
         if(circles_id == 'All'){
             if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    toilets_obj_1['circles_id'] = {$in:circle_details}
                }
             }else{
                 if(acc_circles.length != 0){
                    toilets_obj_1['circles_id'] = {$in:acc_circles}
                 }
             }
         }else{
            toilets_obj_1['circles_id'] = ObjectId(circles_id)
         }
        
        }
        
        if(area_id != '' ){
         if(area_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        toilets_obj_1['area_id'] =  {$in:area_details}
                    }
             }else{ 
                    if(acc_areas.length != 0){
                        toilets_obj_1['area_id'] = {$in:acc_areas}
                    }
             }
         }else{
            toilets_obj_1['area_id'] = ObjectId(area_id)
         }
        
        }
 
        if(ward_id != '' ){
         if(ward_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                       toilets_obj_1['ward_id'] = {$in:ward_details}
                    }
             }else{
                    if(acc_wards.length != 0){
                        toilets_obj_1['ward_id'] = {$in:acc_wards}
                    }
             }
            }else{
                toilets_obj_1['ward_id'] = ObjectId(ward_id)
            }
        
        }

       let total_toilets = await Toilets.find(complex_building_obj_1).countDocuments(); 
       let toilets_attend =  await Toiletsoperation.find(toilets_obj_1).countDocuments();
       return res.status(200).send({login:true,status:true,data:[{name:'Toilet',attend: toilets_attend,notattend:total_toilets-toilets_attend}]})
      // final_array.push({name:'Toilets',attend: toilets_attend,notattend:total_toilets-toilets_attend});
       }
   
    
       if(module_type == 'Parking'){ 
              /* Parking */
       let parking_obj_0 ={db_type:'parkings'};
       parking_obj_0['date'] = formatted_date;
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                    parking_obj_0['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                    parking_obj_0['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            parking_obj_0['zones_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    parking_obj_0['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    parking_obj_0['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            parking_obj_0['circles_id'] = ObjectId(circles_id)
        }
      
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        parking_obj_0['area_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                        parking_obj_0['area_id'] = {$in:acc_areas}
                    }
            }
        }else{
            parking_obj_0['area_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        parking_obj_0['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                       parking_obj_0['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            parking_obj_0['ward_id'] = ObjectId(ward_id)
           }
       
       }

       let total_parking = await Parking.find(complex_building_obj_1).countDocuments(); 
       let parking_attend =  await Operations.find(parking_obj_0).countDocuments(); 
       return res.status(200).send({login:true,success:true,data: [{name:'Parking',attend: parking_attend,notattend:total_parking-parking_attend}]})
      // final_array.push({name:'Parking',attend: parking_attend,notattend:total_parking-parking_attend});
       }


       if(module_type == 'Open place'){ 
        /* Parking */
 let openplace_obj_0 ={db_type:'open_places'};
 openplace_obj_0['date'] = formatted_date;
 if(zones_id != '' ){
  if(zones_id == 'All'){
      if(role_data.name == 'Admin'){
            if(zones_details.length != 0){
               openplace_obj_0['zones_id'] = {$in:zones_details}
            }
      }else{ 
            if(acc_zones.length != 0){
               openplace_obj_0['zones_id'] = {$in:acc_zones}
            }
      }
     }else{
        openplace_obj_0['zones_id'] = ObjectId(zones_id)
     }
 
 }
 
 if(circles_id != '' ){
  if(circles_id == 'All'){
      if(role_data.name == 'Admin'){ 
            if(circle_details.length != 0){
                openplace_obj_0['circles_id'] = {$in:circle_details}
            }
      }else{
            if(acc_circles.length != 0){
                openplace_obj_0['circles_id'] = {$in:acc_circles}
            }
      }
  }else{
    openplace_obj_0['circles_id'] = ObjectId(circles_id)
  }

 }
 
 if(area_id != '' ){
  if(area_id == 'All'){
      if(role_data.name == 'Admin'){
            if(area_details.length != 0){
                openplace_obj_0['area_id'] =  {$in:area_details}
            }
      }else{ 
            if(acc_areas.length != 0){
                openplace_obj_0['area_id'] = {$in:acc_areas}
            }
      }
  }else{
    openplace_obj_0['area_id'] = ObjectId(area_id)
  }
 
 }

 if(ward_id != '' ){
  if(ward_id == 'All'){
      if(role_data.name == 'Admin'){
            if(ward_details.length != 0){
                openplace_obj_0['ward_id'] = {$in:ward_details}
            }
      }else{
            if(acc_wards.length != 0){
                openplace_obj_0['ward_id'] = {$in:acc_wards}
            }
      }
     }else{
        openplace_obj_0['ward_id'] = ObjectId(ward_id)
     }
 
 }

 let total_openplace = await Openplace.find(complex_building_obj_1).countDocuments(); 
 let openplace_attend =  await Operations.find(openplace_obj_0).countDocuments(); 
 return res.status(200).send({login:true,success:true,data: [{name:'Open place',attend: openplace_attend,notattend:total_openplace-openplace_attend}]})
// final_array.push({name:'Parking',attend: parking_attend,notattend:total_parking-parking_attend});
 }

      
       if(module_type == 'Manhole'){

         /* Man hole */
       
       let manhole_obj_1 = {type:'Man hole'}; 
      // manhole_obj_1['date'] = formatted_date;
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){ 
                    manhole_obj_1['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                    manhole_obj_1['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            manhole_obj_1['zones_id'] = ObjectId(zones_id)
           }
     
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    manhole_obj_1['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    manhole_obj_1['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            manhole_obj_1['circles_id'] = ObjectId(circles_id)
        }
      
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        manhole_obj_1['area_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                       manhole_obj_1['area_id'] = {$in:acc_areas}
                    }
            }
        }else{
            manhole_obj_1['area_id'] = ObjectId(area_id)
        }
      
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                       manhole_obj_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                       manhole_obj_1['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            manhole_obj_1['ward_id'] = ObjectId(ward_id)
           }
     
       }
       let total_manhole = await Manhole_tree.find(manhole_obj_1).countDocuments(); 
       let manhole_data  = await Manhole_tree.aggregate([
           {
               "$match":manhole_obj_1
           },
           {
               $lookup:{
                   from: "operations",       // other table name
                   localField: "_id",   // name of users table field
                   foreignField: "collection_id", // name of userinfo table field
                   as: "info_manhole"         // alias for userinfo table
               }   
           },  
           {   $unwind:"$info_manhole" },   
           {"$match": {"info_manhole.date":formatted_date}}, 
          
       ])
       return res.status(200).send({login:true,status:true,data: [{name:'Manhole',attend:manhole_data.length ,notattend:total_manhole-manhole_data.length}]})
      // final_array.push({name:'Man hole',attend:manhole_data.length ,notattend:total_manhole-manhole_data.length});
       } 


      
       if(module_type == 'Tree'){
            /* Tree */
       let tree_obj_1 ={type:'Tree'};
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                    tree_obj_1['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                   tree_obj_1['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            tree_obj_1['zones_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    tree_obj_1['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    tree_obj_1['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            tree_obj_1['circles_id'] = ObjectId(circles_id)
        }
        
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        tree_obj_1['area_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                        tree_obj_1['area_id'] = {$in:acc_areas}
                    }
            }
        }else{
            tree_obj_1['area_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        tree_obj_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                        tree_obj_1['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            tree_obj_1['ward_id'] = ObjectId(ward_id)
           }
      
       }

       let total_tree = await Manhole_tree.find(tree_obj_1).countDocuments(); 
       let tree_data  = await Manhole_tree.aggregate([
           {
               "$match":tree_obj_1
           },
           {
               $lookup:{
                   from: "operations",       // other table name
                   localField: "_id",   // name of users table field
                   foreignField: "collection_id", // name of userinfo table field
                   as: "info_manhole"         // alias for userinfo table
               }   
           },  
           {   $unwind:"$info_manhole" },   
           {"$match": {"info_manhole.date":formatted_date}}, 
          
       ])
   
      // final_array.push({name:'Tree',attend:tree_data.length ,notattend:total_tree-tree_data.length});
      return res.status(200).send({login:true,status:true,data: [{name:'Tree',attend:tree_data.length ,notattend:total_tree-tree_data.length}]})
       }



      
       if(module_type == 'Bus Stop'){
            /* Bus stop */
       let busstop_obj_1 ={type:'Bus Stop'};
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                busstop_obj_1['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                busstop_obj_1['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            busstop_obj_1['zones_id'] = ObjectId(zones_id)
           }
      
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    busstop_obj_1['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    busstop_obj_1['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            busstop_obj_1['circles_id'] = ObjectId(circles_id)
        }
       
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                    busstop_obj_1['area_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                busstop_obj_1['area_id'] = {$in:acc_areas}
                } 
            }
        }else{
            busstop_obj_1['area_id'] = ObjectId(area_id)
        }
      
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        busstop_obj_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                        busstop_obj_1['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            busstop_obj_1['ward_id'] = ObjectId(ward_id)
           }
      
       }

       let total_busstop = await Manhole_tree.find(busstop_obj_1).countDocuments(); 
       let busstop_data  = await Manhole_tree.aggregate([
           {
               "$match":busstop_obj_1
           },
           {
               $lookup:{
                   from: "operations",       // other table name
                   localField: "_id",   // name of users table field
                   foreignField: "collection_id", // name of userinfo table field
                   as: "info_manhole"         // alias for userinfo table
               }   
           },  
           {   $unwind:"$info_manhole" },   
           {"$match": {"info_manhole.date":formatted_date}}, 
          
       ])
         return res.status(200).send({login:true,status:true,data: [{name:'Bus Stop',attend:busstop_data.length ,notattend:total_busstop-busstop_data.length}]})
    //   final_array.push({name:'Bus Stop',attend:busstop_data.length ,notattend:total_busstop-busstop_data.length});
       } 
   

      
       if(module_type == 'Temple'){
            /* Temple */
       let temple_obj = {type:'Temple'}; 
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                    temple_obj['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                    temple_obj['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            temple_obj['zones_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    temple_obj['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                temple_obj['circles_id'] = {$in:acc_circles}
                } 
            }
        }else{
            temple_obj['circles_id'] = ObjectId(circles_id)
        }
      
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        temple_obj['area_id'] =  {$in:area_details}
                    }
            }else{ 
                if(acc_areas.length != 0){
                    temple_obj['area_id'] = {$in:acc_areas}
                }
            }
        }else{
            temple_obj['area_id'] = ObjectId(area_id)
        }
      
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        temple_obj['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                        temple_obj['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            temple_obj['ward_id'] = ObjectId(ward_id)
           }
     
       }
       let total_temple = await Temple.find(temple_obj).countDocuments(); 
       let temple_data  = await Temple.aggregate([
           {
               "$match":temple_obj
           },
           {
               $lookup:{
                   from: "operations",       // other table name
                   localField: "_id",   // name of users table field
                   foreignField: "collection_id", // name of userinfo table field
                   as: "info_manhole"         // alias for userinfo table
               }   
           },  
           {   $unwind:"$info_manhole" },    
           {"$match": {"info_manhole.date":formatted_date}}, 
          
       ])
       return res.status(200).send({login:true,status:true,data:[{name:'Temple',attend: temple_data.length,notattend:total_temple-temple_data.length}]})
    //   final_array.push({name:'Temple',attend: temple_data.length,notattend:total_temple-temple_data.length});
       }


     
       if(module_type == 'Church'){
             /* Church */
       let church_obj ={type:'Church'}; 
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
            //    const zones_details = await Zones.find({tenent_id:tenent_id},{_id:1}).exec(); 
                church_obj['zones_id'] = {$in:zones_details}
            }else{ 
                church_obj['zones_id'] = {$in:acc_zones}
            }
           }else{
            church_obj['zones_id'] = ObjectId(zones_id)
           }
       
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){ 
                    church_obj['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    church_obj['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            church_obj['circles_id'] = ObjectId(circles_id)
        }
      
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        church_obj['area_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                        church_obj['area_id'] = {$in:acc_areas}
                    }
            }
        }else{
            church_obj['area_id'] = ObjectId(area_id)
        }
       
       }

        if(ward_id != '' ){
            if(ward_id == 'All'){
                if(role_data.name == 'Admin'){
                        if(ward_details.length != 0){
                            church_obj['ward_id'] = {$in:ward_details}
                        }
                }else{
                        if(acc_wards.length != 0){
                        church_obj['ward_id'] = {$in:acc_wards}
                        }
                }
            }else{
                church_obj['ward_id'] = ObjectId(ward_id)
            }
       
        }

       let total_church = await Temple.find(church_obj).countDocuments(); 
       let church_data  = await Temple.aggregate([
           {
               "$match":church_obj
           },
           {
               $lookup:{
                   from: "operations",       // other table name
                   localField: "_id",   // name of users table field
                   foreignField: "collection_id", // name of userinfo table field
                   as: "info_manhole"         // alias for userinfo table
               }   
           },  
           {   $unwind:"$info_manhole" },   
           {"$match": {"info_manhole.date":formatted_date}}, 
          
       ])
        return res.status(200).send({login:true,status:true,data:[{name:'Church',attend: church_data.length,notattend:total_church-church_data.length}]})  
     //  final_array.push({name:'Church',attend: church_data.length,notattend:total_church-church_data.length});
       }
   

       
       if(module_type == 'Masjid'){

        /* Majid */
       let masjid_obj ={type:'Masjid'}; 
       if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                    masjid_obj['zones_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                    masjid_obj['zones_id'] = {$in:acc_zones}
                }
            }
           }else{
            masjid_obj['zones_id'] = ObjectId(zones_id)
           }
     
       }
       
       if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    masjid_obj['circles_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    masjid_obj['circles_id'] = {$in:acc_circles}
                }
            }
        }else{
            masjid_obj['circles_id'] = ObjectId(circles_id)
        }
    
       }
       
       if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        masjid_obj['area_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                        masjid_obj['area_id'] = {$in:acc_areas}
                    }
            }
        }else{
            masjid_obj['area_id'] = ObjectId(area_id)
        }
       
       }

       if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        masjid_obj['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                        masjid_obj['ward_id'] = {$in:acc_wards}
                    }
            }
           }else{
            masjid_obj['ward_id'] = ObjectId(ward_id)
           }
       
       }
       let total_masjid = await Temple.find(masjid_obj).countDocuments(); 
       let masjid_data  = await Temple.aggregate([
           {
               "$match":masjid_obj
           }, 
           {
               $lookup:{
                   from: "operations",       // other table name
                   localField: "_id",   // name of users table field
                   foreignField: "collection_id", // name of userinfo table field
                   as: "info_manhole"         // alias for userinfo table
               }   
           },  
           {   $unwind:"$info_manhole" },   
           {"$match": {"info_manhole.date":formatted_date}}, 
          
       ])
       return res.status(200).send({login:true,status:true,data:[{name:'Masjid',attend:masjid_data.length , notattend:total_masjid-masjid_data.length}]})
      // final_array.push({name:'Masjid',attend:masjid_data.length , notattend:total_masjid-masjid_data.length});
       } 



       
    }else{
        
        let final_array_dates = []; 
     
        var d = new Date();
        var date = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear();
        var time  = d.getTime(); 
        let module_name = ''; 
        let  filename;
        let path_name; 
        await Promise.all(dates_search.map( async(date_value,index)=>{

            if(module_type == 'Sat Vehicle'){

                if(index == 0){
                    module_name = 'Sat Vehicle';
                }
                /* Sat attendance present */   
                
          let sat_attendance_1 = {vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,date:date_value }; 
          if(zones_id != '' ){
              if(zones_id == 'All'){
               
               if(role_data.name == 'Admin'){
                    if(zones_details.length != 0){ 
                        sat_attendance_1['zones_id'] = {$in:zones_details}
                    }
               }else{ 
                    if(acc_zones.length != 0){
                        sat_attendance_1['zones_id'] = {$in:acc_zones}
                    }
               }
              }else{
                   sat_attendance_1['zones_id'] = ObjectId(zones_id)
              }
              
          }
          
          if(circles_id != '' ){
             
               if(circles_id == 'All'){
                   if(role_data.name == 'Admin'){ 
                        if(circle_details.length != 0){ 
                            sat_attendance_1['circles_id'] = {$in:circle_details}
                        }
                   }else{
                        if(acc_circles.length != 0){
                            sat_attendance_1['circles_id'] = {$in:acc_circles}
                        }
                   }
               }else{
               sat_attendance_1['circles_id'] = ObjectId(circles_id)
               }
          }
          
          if(area_id != '' ){
               if(area_id == 'All'){
                   if(role_data.name == 'Admin'){
                            if(area_details.length != 0){
                                sat_attendance_1['landmark_id'] =  {$in:area_details}
                            }
                   }else{ 
                           if(acc_areas.length != 0){
                                sat_attendance_1['landmark_id'] = {$in:acc_areas}
                           }
                   }
               }else{
                   sat_attendance_1['landmark_id'] = ObjectId(area_id)
               }
          }
   
          if(ward_id != ''){
              if(ward_id == 'All'){
               if(role_data.name == 'Admin'){
                        if(ward_details.length != 0){
                            sat_attendance_1['ward_id'] = {$in:ward_details}
                        }
               }else{
                        if(acc_wards.length != 0){
                            sat_attendance_1['ward_id'] = {$in:acc_wards}
                        }
               }
              }else{
               sat_attendance_1['ward_id'] = ObjectId(ward_id)
              }
          }
           
           /* Sat attendance abscent */
          let sat_attendance_0 = {vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,date:date_value }; 
         
          if(zones_id != ''){
           if(zones_id == 'All'){
              
               if(role_data.name == 'Admin'){
                    if(zones_details.length != 0){
                        sat_attendance_0['zones_id'] = {$in:zones_details}
                    }
               }else{ 
                    if(acc_zones.length != 0){
                        sat_attendance_0['zones_id'] = {$in:acc_zones}
                    }
               }
              }else{
               sat_attendance_0['zones_id'] = ObjectId(zones_id)
              }
              
          }
          
          if(circles_id != '' ){
           if(circles_id == 'All'){
               if(role_data.name == 'Admin'){ 
                   if(circle_details.length != 0){
                        sat_attendance_0['circles_id'] = {$in:circle_details}
                   }
               }else{
                   if(acc_circles.length != 0){
                        sat_attendance_0['circles_id'] = {$in:acc_circles}
                   }
               }
           }else{
               sat_attendance_0['circles_id'] = ObjectId(circles_id)
           }
          
          }
          
          if(area_id != '' ){
           if(area_id == 'All'){
               if(role_data.name == 'Admin'){
                        if(area_details.length != 0){
                            sat_attendance_0['landmark_id'] =  {$in:area_details}
                        }
               }else{ 
                        if(acc_areas.length != 0){
                            sat_attendance_0['landmark_id'] = {$in:acc_areas}
                        }
               }
           }else{
               sat_attendance_0['landmark_id'] = ObjectId(area_id)
           }
          
          }
   
          if(ward_id != '' ){
           if(ward_id == 'All'){
               if(role_data.name == 'Admin'){
                       if(ward_details.length != 0){
                            sat_attendance_0['ward_id'] = {$in:ward_details}
                       }
               }else{
                       if(acc_wards.length != 0){
                            sat_attendance_0['ward_id'] = {$in:acc_wards}
                       }
               }
              }else{
               sat_attendance_0['ward_id'] = ObjectId(ward_id)
              }
         
          }
    
          let sat_attend = await Vehicle_attendance.find(sat_attendance_1).countDocuments(); 
          let sat_notattend = await Vehicle_attendance.find(sat_attendance_0).countDocuments(); 
          final_array_dates.push({date:date_value,attend:sat_attend,notattend:sat_notattend,index:index}); 
        
         
        }
         
        if(module_type == 'Transport Vehicle'){
            
        //    console.log('Transport vehicle')
            if(index == 0){
                module_name = 'Transport Vehicle';
               
            }
             /* Transport attendance */
        let transport_attendance_1 = {vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,date:date_value }
        if(zones_id != ''){
         if(zones_id == 'All'){
            
             if(role_data.name == 'Admin'){
                    if(zones_details.length != 0){ 
                        transport_attendance_1['zones_id'] = {$in:zones_details}
                    }
             }else{ 
                    if(acc_zones.length != 0){
                        transport_attendance_1['zones_id'] = {$in:acc_zones}
                    }
             }
            }else{
             transport_attendance_1['zones_id'] = ObjectId(zones_id)
            }
         
        }
        
        if(circles_id != ''){
         if(circles_id == 'All'){
             if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    transport_attendance_1['circles_id'] = {$in:circle_details}
                }
             }else{
                    if(acc_circles.length != 0){
                        transport_attendance_1['circles_id'] = {$in:acc_circles}
                    }
             }
         }else{
             transport_attendance_1['circles_id'] = ObjectId(circles_id)
         }
       
        }
        
        if(area_id != '' ){
         if(area_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                       transport_attendance_1['landmark_id'] =  {$in:area_details}
                    }
             }else{ 
                    if(acc_areas.length != 0){
                       transport_attendance_1['landmark_id'] = {$in:acc_areas}
                    }
             }
         }else{
             transport_attendance_1['landmark_id'] = ObjectId(area_id)
         }
       
        }  
 
        if(ward_id != '' ){
         if(ward_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        transport_attendance_1['ward_id'] = {$in:ward_details}
                    }
             }else{
                    if(acc_wards.length != 0){
                        transport_attendance_1['ward_id'] = {$in:acc_wards}
                    }
             }
            }else{
             transport_attendance_1['ward_id'] = ObjectId(ward_id)
            }
       
        }
 
        let transport_attendance_0 = {vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,date:date_value }
        if(zones_id != '' ){
         if(zones_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(zones_details.length != 0){
                        transport_attendance_0['zones_id'] = {$in:zones_details}
                    }
             }else{ 
                    if(acc_zones.length != 0){
                        transport_attendance_0['zones_id'] = {$in:acc_zones}
                    }
             }
            }else{
             transport_attendance_0['zones_id'] = ObjectId(zones_id)
            }
        
        }
        
        if(circles_id != '' ){
         if(circles_id == 'All'){
             if(role_data.name == 'Admin'){  
                if(circle_details.length != 0){
                    transport_attendance_0['circles_id'] = {$in:circle_details}
                }
             }else{
                if(acc_circles.length != 0){
                 transport_attendance_0['circles_id'] = {$in:acc_circles}
                }
             }
         }else{
             transport_attendance_0['circles_id'] = ObjectId(circles_id)
         }
        
        }
        
        if(area_id != '' ){
         if(area_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        transport_attendance_0['landmark_id'] =  {$in:area_details}
                    }
             }else{ 
                    if(acc_areas.length != 0){
                        transport_attendance_0['landmark_id'] = {$in:acc_areas}
                    }
             }
         }else{
             transport_attendance_0['landmark_id'] = ObjectId(area_id)
         }
        
        }
 
        if(ward_id != '' ){
         if(ward_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        transport_attendance_0['ward_id'] = {$in:ward_details}
                    }
             }else{
                    if(acc_wards.length != 0){
                        transport_attendance_0['ward_id'] = {$in:acc_wards}
                    }
             }
            }else{
             transport_attendance_0['ward_id'] = ObjectId(ward_id)
            }
       
        } 
        let transport_attend = await Vehicle_attendance.find(transport_attendance_1).countDocuments(); 
        let transport_notattend = await Vehicle_attendance.find(transport_attendance_0).countDocuments(); 
        final_array_dates.push({date:date_value ,attend:transport_attend,notattend:transport_notattend,index:index})
      
        }
        
        
       if(module_type == 'GVP/BEP'){
        /* Gvpbep */
        if(index == 0){
            module_name = 'GVP/BEP';
           
        }
        let garbage_obj_1 = {type:{$in : ['Gvp','GVP','Bep','BEP']},date:date_value  } 
        if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                    garbage_obj_1['zone_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                    garbage_obj_1['zone_id'] = {$in:acc_zones}
                }
            }
            }else{
            garbage_obj_1['zone_id'] = ObjectId(zones_id)
            }
        
        }
        
        if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                    if(circle_details.length != 0){
                        garbage_obj_1['circle_id'] = {$in:circle_details}
                    }
            }else{
                    if(acc_circles.length != 0){
                        garbage_obj_1['circle_id'] = {$in:acc_circles}
                    }
            }
        }else{
            garbage_obj_1['circle_id'] = ObjectId(circles_id)
        }
        
        }
        
        if(area_id != ''){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        garbage_obj_1['landmark_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                        garbage_obj_1['landmark_id'] = {$in:acc_areas}
                    }
            }
        }else{
            garbage_obj_1['landmark_id'] = ObjectId(area_id)
        }
        
        }

        if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                       garbage_obj_1['ward_id'] = {$in:ward_details}
                    }
            }else{
                    if(acc_wards.length != 0){
                       garbage_obj_1['ward_id'] = {$in:acc_wards}
                    }
            }
            }else{
            garbage_obj_1['ward_id'] = ObjectId(ward_id)
            }
        
        }


        let garbage_obj_0 = { }
        if(zones_id != '' ){
        if(zones_id == 'All'){
            if(role_data.name == 'Admin'){
                if(zones_details.length != 0){
                    garbage_obj_0['zone_id'] = {$in:zones_details}
                }
            }else{ 
                if(acc_zones.length != 0){
                    garbage_obj_0['zone_id'] = {$in:acc_zones}
                }
            }
            }else{
            garbage_obj_0['zone_id'] = ObjectId(zones_id)
            }
        
        }
        
        if(circles_id != '' ){
        if(circles_id == 'All'){
            if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    garbage_obj_0['circle_id'] = {$in:circle_details}
                }
            }else{
                if(acc_circles.length != 0){
                    garbage_obj_0['circle_id'] = {$in:acc_circles}
                }
            }
        }else{
            garbage_obj_0['circle_id'] = ObjectId(circles_id)
        }
        
        }
        
        if(area_id != '' ){
        if(area_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                        garbage_obj_0['area_id'] =  {$in:area_details}
                    }
            }else{ 
                    if(acc_areas.length != 0){
                        garbage_obj_0['area_id'] = {$in:acc_areas}
                    }
            }
        }else{
            garbage_obj_0['area_id'] = ObjectId(area_id)
        }

        }

        if(ward_id != '' ){
        if(ward_id == 'All'){
            if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                       garbage_obj_0['ward_id'] = {$in:ward_details}
                    } 
            }else{
                    if(acc_wards.length != 0){
                       garbage_obj_0['ward_id'] = {$in:acc_wards}
                    }
            }
            }else{
            garbage_obj_0['ward_id'] = ObjectId(ward_id)
            }

        }

        let gvp_attend = await Gvepbeptrips.find(garbage_obj_1).countDocuments();
        let gvp_total = await Gvpbep.find(garbage_obj_0).countDocuments();
        final_array_dates.push({date:date_value ,attend: gvp_attend,notattend:gvp_total - gvp_attend,index:index})

} 


  let complex_building_obj_1 = {}; 
  if(zones_id != '' ){
   if(zones_id == 'All'){ 
       if(role_data.name == 'Admin'){
            if(zones_details.length != 0){
                complex_building_obj_1['zones_id'] = {$in:zones_details}
            }
       }else{ 
            if(acc_zones.length != 0){
                complex_building_obj_1['zones_id'] = {$in:acc_zones}
            }
       }
      }else{
       complex_building_obj_1['zones_id'] = ObjectId(zones_id)
      }
 
  }
  
  if(circles_id != ''){
   if(circles_id == 'All'){
       if(role_data.name == 'Admin'){ 
            if(circle_details.length != 0){
                complex_building_obj_1['circles_id'] = {$in:circle_details}
            }
       }else{
           if(acc_circles.length != 0){
                complex_building_obj_1['circles_id'] = {$in:acc_circles}
           }
       }
   }else{
       complex_building_obj_1['circles_id'] = ObjectId(circles_id)
   }
  
  }
  
  if(area_id != '' ){
   if(area_id == 'All'){
       if(role_data.name == 'Admin'){
                if(area_details.length != 0){
                    complex_building_obj_1['area_id'] =  {$in:area_details}
                }
       }else{ 
                if(acc_areas.length != 0){
                    complex_building_obj_1['area_id'] = {$in:acc_areas}
                }
       }
   }else{
       complex_building_obj_1['area_id'] = ObjectId(area_id)
   }
  
  }

  if(ward_id != '' ){
   if(ward_id == 'All'){
       if(role_data.name == 'Admin'){
               if(ward_details.length != 0){
                    complex_building_obj_1['ward_id'] = {$in:ward_details}
               }
       }else{
               if(acc_wards.length != 0){
                   complex_building_obj_1['ward_id'] = {$in:acc_wards}
               }
       }
      }else{
       complex_building_obj_1['ward_id'] = ObjectId(ward_id)
      }
  
  }

  if(module_type == 'Complex & Building'){ 
    /* Complex building */
     if(index == 0){
        module_name = 'Complex & Building';
       
     }

let complex_building_obj_0 = {db_type:'comercial_buildings'}; 
complex_building_obj_0['date'] = date_value; 
if(zones_id != '' ){
if(zones_id == 'All'){
    if(role_data.name == 'Admin'){
        if(zones_details.length != 0){
            complex_building_obj_0['zones_id'] = {$in:zones_details}
        }
    }else{ 
        if(acc_zones.length != 0){
            complex_building_obj_0['zones_id'] = {$in:acc_zones}
        }
    }
   }else{
    complex_building_obj_0['zones_id'] = ObjectId(zones_id)
   }

}

if(circles_id != '' ){
if(circles_id == 'All'){
    if(role_data.name == 'Admin'){ 
         if(circle_details.length != 0){
            complex_building_obj_0['circles_id'] = {$in:circle_details}
         }
    }else{
        if(acc_circles.length != 0){
            complex_building_obj_0['circles_id'] = {$in:acc_circles}
        }
    }
}else{
    complex_building_obj_0['circles_id'] = ObjectId(circles_id)
}

}

if(area_id != '' ){
if(area_id == 'All'){
    if(role_data.name == 'Admin'){
            if(area_details.length != 0){
                complex_building_obj_0['area_id'] =  {$in:area_details}
            }
    }else{ 
            if(acc_areas.length != 0){
                complex_building_obj_0['area_id'] = {$in:acc_areas}
            }
    }
}else{
    complex_building_obj_0['area_id'] = ObjectId(area_id)
}

}

if(ward_id != '' ){
if(ward_id == 'All'){
    if(role_data.name == 'Admin'){
            if(ward_details.length != 0){
                complex_building_obj_0['ward_id'] = {$in:ward_details}
            }
    }else{
            if(acc_wards.length != 0){
                complex_building_obj_0['ward_id'] = {$in:acc_wards}
            }
    }
   }else{
    complex_building_obj_0['ward_id'] = ObjectId(ward_id)
   }

}

let total_complex = await Complex_building.find(complex_building_obj_1).countDocuments(); 
let complex_attend =  await Operations.find(complex_building_obj_0).countDocuments();  
final_array_dates.push({date:date_value, attend:complex_attend, notattend:total_complex-complex_attend,index:index})

}
 
      /* Residential House */
      if(module_type == 'Residential/house'){ 
        let Residential_house_0 = {db_type:'residential_houses'};
        if(index == 0){
            module_name = 'Residential/house';
           
        }
        Residential_house_0['date'] = date_value;
        if(zones_id != '' ){
         if(zones_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(zones_details.length != 0){
                        Residential_house_0['zones_id'] = {$in:zones_details}
                    }
             }else{ 
                    if(acc_zones.length != 0){
                       Residential_house_0['zones_id'] = {$in:acc_zones}
                    }
             }
            }else{
             Residential_house_0['zones_id'] = ObjectId(zones_id)
            }
      
        }
        
        if(circles_id != ''){
         if(circles_id == 'All'){
             if(role_data.name == 'Admin'){ 
                    if(circle_details.length != 0){ 
                        Residential_house_0['circles_id'] = {$in:circle_details}
                    }
             }else{
                    if(acc_circles.length != 0){
                        Residential_house_0['circles_id'] = {$in:acc_circles}
                    }
             }
         }else{
             Residential_house_0['circles_id'] = ObjectId(circles_id)
         }
        
        }
        
        if(area_id != ''){
         if(area_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(area_details.length != 0){
                       Residential_house_0['area_id'] =  {$in:area_details}
                    }
             }else{ 
                    if(acc_areas.length != 0){
                        Residential_house_0['area_id'] = {$in:acc_areas}
                    }
             }
         }else{
             Residential_house_0['area_id'] = ObjectId(area_id)
         }
      
        }
 
        if(ward_id != '' ){
         if(ward_id == 'All'){
             if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                        Residential_house_0['ward_id'] = {$in:ward_details}
                    }
             }else{
                    if(acc_wards.length != 0){
                        Residential_house_0['ward_id'] = {$in:acc_wards}
                    }
             }
            }else{
             Residential_house_0['ward_id'] = ObjectId(ward_id)
            }
       
        }
      
        let total_residential = await Residential_house.find(complex_building_obj_1).countDocuments(); 
        let residential_attend =  await Operations.find(Residential_house_0).countDocuments();
        final_array_dates.push({date:date_value ,attend:residential_attend ,notattend:total_residential-residential_attend,index:index})
      
    }

        if(module_type == 'Open place'){
            let openplace_obj_0 ={db_type:'open_places'};
            if(index == 0){
                module_name = 'Open place';
             
            }
            openplace_obj_0['date'] = date_value;
            if(zones_id != '' ){
            if(zones_id == 'All'){
                if(role_data.name == 'Admin'){
                        if(zones_details.length != 0){
                        openplace_obj_0['zones_id'] = {$in:zones_details}
                        }
                }else{ 
                        if(acc_zones.length != 0){
                        openplace_obj_0['zones_id'] = {$in:acc_zones}
                        }
                }
                }else{
                    openplace_obj_0['zones_id'] = ObjectId(zones_id)
                }
            
            }
            
            if(circles_id != '' ){
            if(circles_id == 'All'){
                if(role_data.name == 'Admin'){ 
                        if(circle_details.length != 0){
                            openplace_obj_0['circles_id'] = {$in:circle_details}
                        }
                }else{
                        if(acc_circles.length != 0){
                            openplace_obj_0['circles_id'] = {$in:acc_circles}
                        }
                }
            }else{
                openplace_obj_0['circles_id'] = ObjectId(circles_id)
            }

            }
            
            if(area_id != '' ){
            if(area_id == 'All'){
                if(role_data.name == 'Admin'){
                        if(area_details.length != 0){
                            openplace_obj_0['area_id'] =  {$in:area_details}
                        }
                }else{ 
                        if(acc_areas.length != 0){
                            openplace_obj_0['area_id'] = {$in:acc_areas}
                        }
                }
            }else{
                openplace_obj_0['area_id'] = ObjectId(area_id)
            }
            
            }

            if(ward_id != '' ){
            if(ward_id == 'All'){
                if(role_data.name == 'Admin'){
                        if(ward_details.length != 0){
                            openplace_obj_0['ward_id'] = {$in:ward_details}
                        }
                }else{
                        if(acc_wards.length != 0){
                            openplace_obj_0['ward_id'] = {$in:acc_wards}
                        }
                }
                }else{
                    openplace_obj_0['ward_id'] = ObjectId(ward_id)
                }
            
            }
       
            let total_openplace = await Openplace.find(complex_building_obj_1).countDocuments(); 
            let openplace_attend =  await Operations.find(openplace_obj_0).countDocuments();   
            final_array_dates.push({date:date_value,attend: openplace_attend,notattend:total_openplace-openplace_attend,index:index})
        
        }

        if(module_type == 'Street Vendor'){ 
             if(index == 0){
                module_name = 'Street Vendor';
               
             }
            /* Street Vendor */
          let street_vendor_0 ={db_type:'streetvendors'}; 
          street_vendor_0['date'] = date_value;
          if(zones_id != '' ){
           if(zones_id == 'All'){
               if(role_data.name == 'Admin'){
                   if(zones_details.length != 0){
                   street_vendor_0['zones_id'] = {$in:zones_details}
                   }
               }else{ 
                   if(acc_zones.length != 0){
                   street_vendor_0['zones_id'] = {$in:acc_zones}
                   }
               }
              }else{
               street_vendor_0['zones_id'] = ObjectId(zones_id)
              }
         
          }
          
          if(circles_id != ''){
           if(circles_id == 'All'){
               if(role_data.name == 'Admin'){ 
                   if(circle_details.length != 0){
                        street_vendor_0['circles_id'] = {$in:circle_details}
                   }
               }else{
                   if(acc_circles.length != 0){
                   street_vendor_0['circles_id'] = {$in:acc_circles}
                   } 
               }
           }else{
               street_vendor_0['circles_id'] = ObjectId(circles_id)
           }
          
          }
          
          if(area_id != '' ){
           if(area_id == 'All'){
               if(role_data.name == 'Admin'){
                       if(area_details.length != 0){
                            street_vendor_0['area_id'] =  {$in:area_details}
                       }
               }else{ 
                       if(acc_areas.length != 0){
                            street_vendor_0['area_id'] = {$in:acc_areas}
                       }
               }
           }else{
               street_vendor_0['area_id'] = ObjectId(area_id)
           }
        
          }
   
          if(ward_id != '' ){
           if(ward_id == 'All'){
               if(role_data.name == 'Admin'){
                       if(ward_details.length != 0){
                            street_vendor_0['ward_id'] = {$in:ward_details}
                       }
               }else{
                        if(acc_wards.length != 0){
                            street_vendor_0['ward_id'] = {$in:acc_wards}
                        }
               }
              }else{
               street_vendor_0['ward_id'] = ObjectId(ward_id)
              }
          
          }
   
          let total_street = await Street_vendor.find(complex_building_obj_1).countDocuments(); 
          let street_attend =  await Operations.find(street_vendor_0).countDocuments();
          final_array_dates.push({date:date_value,attend:street_attend, notattend:total_street-street_attend,index:index })
        
        } 


          if(module_type == 'Community Hall'){ 
              if(index == 0){
                module_name = 'Community Hall';
              
              }
            /* Community Hall */
      let community_hal_obj_0 ={db_type:'communityhalls'};
      community_hal_obj_0['date'] = date_value;
      if(zones_id != '' ){
       if(zones_id == 'All'){
           if(role_data.name == 'Admin'){
               if(zones_details.length != 0){ 
                    community_hal_obj_0['zones_id'] = {$in:zones_details}
               }
           }else{ 
               if(acc_zones.length != 0){
                    community_hal_obj_0['zones_id'] = {$in:acc_zones}
               }
           }
          }else{
           community_hal_obj_0['zones_id'] = ObjectId(zones_id)
          }
      
      }
      
      if(circles_id != '' ){
       if(circles_id == 'All'){
           if(role_data.name == 'Admin'){ 
                if(circle_details.length != 0){
                    community_hal_obj_0['circles_id'] = {$in:circle_details}
                }
           }else{
               if(acc_circles.length != 0){
                    community_hal_obj_0['circles_id'] = {$in:acc_circles}
               }
           }
       }else{
           community_hal_obj_0['circles_id'] = ObjectId(circles_id)
       }
      
      }
      
      if(area_id != '' ){
       if(area_id == 'All'){
           if(role_data.name == 'Admin'){
                   if(area_details.length != 0){
                       community_hal_obj_0['landmark_id'] =  {$in:area_details}
                   }
           }else{ 
               if(acc_areas.length != 0){
                   community_hal_obj_0['landmark_id'] = {$in:acc_areas}
               }
           }
       }else{
           community_hal_obj_0['landmark_id'] = ObjectId(area_id)
       }
      
      }

      if(ward_id != '' ){
       if(ward_id == 'All'){
           if(role_data.name == 'Admin'){
                    if(ward_details.length != 0){
                       community_hal_obj_0['ward_id'] = {$in:ward_details}
                    }
           }else{
                    if(acc_wards.length != 0){
                        community_hal_obj_0['ward_id'] = {$in:acc_wards}
                    }
           }
          }else{
           community_hal_obj_0['ward_id'] = ObjectId(ward_id)
          }
      
      }

      let total_communityhall = await Community_hall.find(complex_building_obj_1).countDocuments(); 
      let community_attend =  await Operations.find(community_hal_obj_0).countDocuments();
      final_array_dates.push({date: date_value,attend:community_attend ,notattend:total_communityhall-community_attend,index:index })
    
    }

        /* Toilets */
        if(module_type == 'Toilet'){  
            if(index == 0){
                module_name = 'Toilet';
              
            }
            let toilets_obj_1 = {}; 
            toilets_obj_1['date'] = date_value; 
            if(zones_id != '' ){
             if(zones_id == 'All'){ 
                 if(role_data.name == 'Admin'){
                    if(zones_details.length != 0){
                        toilets_obj_1['zones_id'] = {$in:zones_details}
                    }
                 }else{ 
                     if(acc_zones.length != 0){
                        toilets_obj_1['zones_id'] = {$in:acc_zones}
                     }
                 }
                }else{
                    toilets_obj_1['zones_id'] = ObjectId(zones_id)
                }
           
            }
            
            if(circles_id != ''){
             if(circles_id == 'All'){
                 if(role_data.name == 'Admin'){ 
                    if(circle_details.length != 0){
                        toilets_obj_1['circles_id'] = {$in:circle_details}
                    }
                 }else{
                     if(acc_circles.length != 0){
                        toilets_obj_1['circles_id'] = {$in:acc_circles}
                     }
                 }
             }else{
                toilets_obj_1['circles_id'] = ObjectId(circles_id)
             }
            
            }
            
            if(area_id != '' ){
             if(area_id == 'All'){
                 if(role_data.name == 'Admin'){
                       if(area_details.length != 0){
                            toilets_obj_1['area_id'] =  {$in:area_details}
                       }
                 }else{ 
                       if(acc_areas.length != 0){
                            toilets_obj_1['area_id'] = {$in:acc_areas}
                       }
                 }
             }else{
                toilets_obj_1['area_id'] = ObjectId(area_id)
             }
            
            }
     
            if(ward_id != '' ){
             if(ward_id == 'All'){
                 if(role_data.name == 'Admin'){
                        if(ward_details.length != 0){
                            toilets_obj_1['ward_id'] = {$in:ward_details}
                        }
                 }else{
                        if(acc_wards.length != 0){
                            toilets_obj_1['ward_id'] = {$in:acc_wards}
                        }
                 }
                }else{
                    toilets_obj_1['ward_id'] = ObjectId(ward_id)
                }
            
            }
           console.log(toilets_obj_1);   
           let total_toilets = await Toilets.find(complex_building_obj_1).countDocuments(); 
           let toilets_attend =  await Toiletsoperation.find(toilets_obj_1).countDocuments(); 
           final_array_dates.push({date:date_value,attend: toilets_attend,notattend:total_toilets-toilets_attend,index:index})
       
           }
          
        
            
       if(module_type == 'Parking'){ 
           if(index == 0){
            module_name = 'Parking';
           
           }
        /* Parking */
 let parking_obj_0 ={db_type:'parkings'};
 parking_obj_0['date'] = date_value;
 if(zones_id != '' ){
  if(zones_id == 'All'){
      if(role_data.name == 'Admin'){
            if(zones_details.length != 0){
               parking_obj_0['zones_id'] = {$in:zones_details}
            }
      }else{ 
           if(acc_zones.length != 0){
               parking_obj_0['zones_id'] = {$in:acc_zones}
           }
      }
     }else{
      parking_obj_0['zones_id'] = ObjectId(zones_id)
     }
 
 }
 
 if(circles_id != '' ){
  if(circles_id == 'All'){
      if(role_data.name == 'Admin'){ 
           if(circle_details.length != 0){
                parking_obj_0['circles_id'] = {$in:circle_details}
           }
      }else{
          if(acc_circles.length != 0){
               parking_obj_0['circles_id'] = {$in:acc_circles}
          }
      }
  }else{
      parking_obj_0['circles_id'] = ObjectId(circles_id)
  }

 }
 
 if(area_id != '' ){
  if(area_id == 'All'){
      if(role_data.name == 'Admin'){
                if(area_details.length != 0){
                   parking_obj_0['area_id'] =  {$in:area_details}
                }
      }else{ 
                if(acc_areas.length != 0){
                    parking_obj_0['area_id'] = {$in:acc_areas}
                }
      }
  }else{
      parking_obj_0['area_id'] = ObjectId(area_id)
  }
 
 }

 if(ward_id != '' ){
  if(ward_id == 'All'){
      if(role_data.name == 'Admin'){
                if(ward_details.length != 0){
                    parking_obj_0['ward_id'] = {$in:ward_details}
                }
      }else{
                if(acc_wards.length != 0){
                    parking_obj_0['ward_id'] = {$in:acc_wards}
                }
      }
     }else{
      parking_obj_0['ward_id'] = ObjectId(ward_id)
     }
 
 }

 let total_parking = await Parking.find(complex_building_obj_1).countDocuments(); 
 let parking_attend =  await Operations.find(parking_obj_0).countDocuments(); 
 final_array_dates.push({date: date_value,attend: parking_attend,notattend:total_parking-parking_attend,index:index })

}


 if(module_type == 'Manhole'){

    if(index == 0){
        module_name = 'Manhole';
      
    }
    /* Man hole */
  
  let manhole_obj_1 = {type:'Man hole'}; 
 // manhole_obj_1['date'] = formatted_date;
  if(zones_id != '' ){
   if(zones_id == 'All'){
       if(role_data.name == 'Admin'){
            if(zones_details.length != 0){
               manhole_obj_1['zones_id'] = {$in:zones_details}
            }
       }else{ 
           if(acc_zones.length != 0){
               manhole_obj_1['zones_id'] = {$in:acc_zones}
           }
       }
      }else{
       manhole_obj_1['zones_id'] = ObjectId(zones_id)
      }

  }
  
  if(circles_id != '' ){
   if(circles_id == 'All'){
       if(role_data.name == 'Admin'){ 
           if(circle_details.length != 0){
               manhole_obj_1['circles_id'] = {$in:circle_details}
           }
       }else{
           if(acc_circles.length != 0){
               manhole_obj_1['circles_id'] = {$in:acc_circles}
           }
       }
   }else{
       manhole_obj_1['circles_id'] = ObjectId(circles_id)
   }
 
  }
  
  if(area_id != '' ){
   if(area_id == 'All'){
       if(role_data.name == 'Admin'){
               if(area_details.length != 0){
                   manhole_obj_1['area_id'] =  {$in:area_details}
               }
       }else{ 
               if(acc_areas.length != 0){
                    manhole_obj_1['area_id'] = {$in:acc_areas}
               }
       }
   }else{
       manhole_obj_1['area_id'] = ObjectId(area_id)
   }
 
  }

  if(ward_id != '' ){
   if(ward_id == 'All'){
       if(role_data.name == 'Admin'){
               if(ward_details.length != 0){
                   manhole_obj_1['ward_id'] = {$in:ward_details}
               }
       }else{
               if(acc_wards.length != 0){
                   manhole_obj_1['ward_id'] = {$in:acc_wards}
               }
       }
      }else{
       manhole_obj_1['ward_id'] = ObjectId(ward_id)
      }

  }
  let total_manhole = await Manhole_tree.find(manhole_obj_1).countDocuments(); 
  let manhole_data  = await Manhole_tree.aggregate([
      {
          "$match":manhole_obj_1
      },
      {
          $lookup:{
              from: "operations",       // other table name
              localField: "_id",   // name of users table field
              foreignField: "collection_id", // name of userinfo table field
              as: "info_manhole"         // alias for userinfo table
          }   
      },  
      {   $unwind:"$info_manhole" },   
      {"$match": {"info_manhole.date":date_value}}, 
     
  ])
  final_array_dates.push({date: date_value,attend:manhole_data.length ,notattend:total_manhole-manhole_data.length,index:index })

} 

    
  if(module_type == 'Tree'){
      if(index == 0){
        module_name = 'Tree';
      
      }
    /* Tree */
let tree_obj_1 ={type:'Tree'};
if(zones_id != '' ){
if(zones_id == 'All'){
    if(role_data.name == 'Admin'){
        if(zones_details.length != 0){
            tree_obj_1['zones_id'] = {$in:zones_details}
        }
    }else{ 
        if(acc_zones.length != 0){
            tree_obj_1['zones_id'] = {$in:acc_zones}
        }
    }
   }else{
    tree_obj_1['zones_id'] = ObjectId(zones_id)
   }

}

if(circles_id != '' ){
if(circles_id == 'All'){
    if(role_data.name == 'Admin'){ 
         if(circle_details.length != 0){
            tree_obj_1['circles_id'] = {$in:circle_details}
         }
    }else{
         if(acc_circles.length != 0){
            tree_obj_1['circles_id'] = {$in:acc_circles}
         }
    }
}else{
    tree_obj_1['circles_id'] = ObjectId(circles_id)
}

}

if(area_id != '' ){
if(area_id == 'All'){
    if(role_data.name == 'Admin'){
            if(area_details.length != 0){
                tree_obj_1['area_id'] =  {$in:area_details}
            }
    }else{ 
           if(acc_areas.length != 0){
                tree_obj_1['area_id'] = {$in:acc_areas}
           }
    }
}else{
    tree_obj_1['area_id'] = ObjectId(area_id)
}

}

if(ward_id != '' ){
if(ward_id == 'All'){
    if(role_data.name == 'Admin'){
            if(ward_details.length != 0){
                tree_obj_1['ward_id'] = {$in:ward_details}
            }
    }else{
            if(acc_wards.length != 0){
                tree_obj_1['ward_id'] = {$in:acc_wards}
            }
    }
   }else{
    tree_obj_1['ward_id'] = ObjectId(ward_id)
   }

}

let total_tree = await Manhole_tree.find(tree_obj_1).countDocuments(); 
let tree_data  = await Manhole_tree.aggregate([
   {
       "$match":tree_obj_1
   },
   {
       $lookup:{
           from: "operations",       // other table name
           localField: "_id",   // name of users table field
           foreignField: "collection_id", // name of userinfo table field
           as: "info_manhole"         // alias for userinfo table
       }   
   },  
   {   $unwind:"$info_manhole" },   
   {"$match": {"info_manhole.date":date_value}}, 
  
])
final_array_dates.push({date: date_value,attend:tree_data.length ,notattend:total_tree-tree_data.length,index:index })
// final_array.push({name:'Tree',attend:tree_data.length ,notattend:total_tree-tree_data.length});
 //return res.status(200).send({login:true,status:true,data: [{name:'Tree',attend:tree_data.length ,notattend:total_tree-tree_data.length}]})
}
    
    
      
if(module_type == 'Bus Stop'){
    if(index == 0){
        module_name = 'Bus Stop';
       // satatt_obj['dates_range'] = [];
    }
    /* Bus stop */
let busstop_obj_1 ={type:'Bus Stop'};
if(zones_id != '' ){
if(zones_id == 'All'){
    if(role_data.name == 'Admin'){
        if(zones_details.length != 0){
        busstop_obj_1['zones_id'] = {$in:zones_details}
        }
    }else{
        if(acc_zones.length != 0){ 
        busstop_obj_1['zones_id'] = {$in:acc_zones}
        }
    }
   }else{
    busstop_obj_1['zones_id'] = ObjectId(zones_id)
   }

}

if(circles_id != '' ){
if(circles_id == 'All'){
    if(role_data.name == 'Admin'){ 
        if(circle_details.length != 0){
           busstop_obj_1['circles_id'] = {$in:circle_details}
        }
    }else{
        if(acc_circles.length != 0){
            busstop_obj_1['circles_id'] = {$in:acc_circles}
        }
    }
}else{
    busstop_obj_1['circles_id'] = ObjectId(circles_id)
}

}

if(area_id != '' ){
if(area_id == 'All'){
    if(role_data.name == 'Admin'){
            if(area_details.length != 0){
                busstop_obj_1['area_id'] =  {$in:area_details}
            }
    }else{ 
        if(acc_areas.length != 0){
        busstop_obj_1['area_id'] = {$in:acc_areas}
        }  
    }
}else{
    busstop_obj_1['area_id'] = ObjectId(area_id)
}

}

if(ward_id != '' ){
if(ward_id == 'All'){
    if(role_data.name == 'Admin'){
            if(ward_details.length != 0){
                busstop_obj_1['ward_id'] = {$in:ward_details}
            }
    }else{
        if(acc_wards.length != 0){
            busstop_obj_1['ward_id'] = {$in:acc_wards}
        }
    }
   }else{
    busstop_obj_1['ward_id'] = ObjectId(ward_id)
   }

}

let total_busstop = await Manhole_tree.find(busstop_obj_1).countDocuments(); 
let busstop_data  = await Manhole_tree.aggregate([
   {
       "$match":busstop_obj_1
   },
   {
       $lookup:{
           from: "operations",       // other table name
           localField: "_id",   // name of users table field
           foreignField: "collection_id", // name of userinfo table field
           as: "info_manhole"         // alias for userinfo table
       }   
   },  
   {   $unwind:"$info_manhole" },   
   {"$match": {"info_manhole.date":date_value}}, 
  
])
final_array_dates.push({date:date_value,attend:busstop_data.length ,notattend:total_busstop-busstop_data.length,index:index })

} 

      
if(module_type == 'Temple'){

    if(index == 0){
        module_name = 'Temple';
       // satatt_obj['dates_range'] = [];
    }
    /* Temple */
let temple_obj = {type:'Temple'}; 
if(zones_id != '' ){
if(zones_id == 'All'){
    if(role_data.name == 'Admin'){
        if(zones_details.length != 0){
            temple_obj['zones_id'] = {$in:zones_details}
        }
    }else{ 
        if(acc_zones.length != 0){
            temple_obj['zones_id'] = {$in:acc_zones}
        }
    }
   }else{
    temple_obj['zones_id'] = ObjectId(zones_id)
   }

}

if(circles_id != '' ){
if(circles_id == 'All'){
    if(role_data.name == 'Admin'){ 
        if(circle_details.length != 0){
            temple_obj['circles_id'] = {$in:circle_details}
        }
    }else{
        if(acc_circles.length != 0){
            temple_obj['circles_id'] = {$in:acc_circles}
        }
    }
}else{
    temple_obj['circles_id'] = ObjectId(circles_id)
}

}

if(area_id != '' ){
if(area_id == 'All'){
    if(role_data.name == 'Admin'){
           if(area_details.length != 0){
            temple_obj['area_id'] =  {$in:area_details}
           }
    }else{ 
        if(acc_areas.length != 0){
           temple_obj['area_id'] = {$in:acc_areas}
        }
    }
}else{
    temple_obj['area_id'] = ObjectId(area_id)
}

}

if(ward_id != '' ){
if(ward_id == 'All'){
    if(role_data.name == 'Admin'){
            if(ward_details.length != 0){
            temple_obj['ward_id'] = {$in:ward_details}
            }
    }else{
        if(acc_wards.length != 0){
            temple_obj['ward_id'] = {$in:acc_wards}
        }
    }
   }else{
    temple_obj['ward_id'] = ObjectId(ward_id)
   }

}
let total_temple = await Temple.find(temple_obj).countDocuments(); 
let temple_data  = await Temple.aggregate([
   {
       "$match":temple_obj
   },
   {
       $lookup:{
           from: "operations",       // other table name
           localField: "_id",   // name of users table field
           foreignField: "collection_id", // name of userinfo table field
           as: "info_manhole"         // alias for userinfo table
       }   
   },  
   {   $unwind:"$info_manhole" },    
   {"$match": {"info_manhole.date":date_value}}, 
  
])
    final_array_dates.push({date: date_value,attend: temple_data.length,notattend:total_temple-temple_data.length,index:index })

}
    
if(module_type == 'Church'){
    if(index == 0){
        module_name = 'Church';
    
    }
    /* Church */
let church_obj ={type:'Church'}; 
if(zones_id != '' ){
if(zones_id == 'All'){
   if(role_data.name == 'Admin'){
       if(zones_details.length != 0){
       church_obj['zones_id'] = {$in:zones_details}
       }
   }else{
       if(acc_zones.length != 0){ 
       church_obj['zones_id'] = {$in:acc_zones}
       }
   }
  }else{
   church_obj['zones_id'] = ObjectId(zones_id)
  }

}

if(circles_id != '' ){
if(circles_id == 'All'){
   if(role_data.name == 'Admin'){ 
        if(circle_details.length != 0){
            church_obj['circles_id'] = {$in:circle_details}
        }
   }else{
       if(acc_circles.length != 0){
            church_obj['circles_id'] = {$in:acc_circles}
       }
   }
}else{
   church_obj['circles_id'] = ObjectId(circles_id)
}

}

if(area_id != '' ){
if(area_id == 'All'){
   if(role_data.name == 'Admin'){
          if(area_details.length != 0){
           church_obj['area_id'] =  {$in:area_details}
          }
   }else{ 
       if(acc_areas.length != 0){
            church_obj['area_id'] = {$in:acc_areas}
       }
   }
}else{
   church_obj['area_id'] = ObjectId(area_id)
}

}

if(ward_id != '' ){
if(ward_id == 'All'){
   if(role_data.name == 'Admin'){
           if(ward_details.length != 0){
                church_obj['ward_id'] = {$in:ward_details}
           }
   }else{
           if(acc_wards.length != 0){
                church_obj['ward_id'] = {$in:acc_wards}
           }
   }
  }else{
   church_obj['ward_id'] = ObjectId(ward_id)
  }

}

let total_church = await Temple.find(church_obj).countDocuments(); 
let church_data  = await Temple.aggregate([
  {
      "$match":church_obj
  },
  {
      $lookup:{
          from: "operations",       // other table name
          localField: "_id",   // name of users table field
          foreignField: "collection_id", // name of userinfo table field
          as: "info_manhole"         // alias for userinfo table
      }   
  },  
  {   $unwind:"$info_manhole" },   
  {"$match": {"info_manhole.date":date_value}}, 
 
])
final_array_dates.push({date: date_value,attend: church_data.length,notattend:total_church-church_data.length,index:index })

}

if(module_type == 'Masjid'){
   
    if(index == 0){
        module_name = 'Masjid';
    }
    /* Majid */
   let masjid_obj ={type:'Masjid'}; 

   if(zones_id != '' ){
    if(zones_id == 'All'){
        if(role_data.name == 'Admin'){
            if(zones_details.length != 0){
                masjid_obj['zones_id'] = {$in:zones_details}
            }
        }else{ 
            if(acc_zones.length != 0){
                masjid_obj['zones_id'] = {$in:acc_zones}
            }
        } 
       }else{
        masjid_obj['zones_id'] = ObjectId(zones_id)
       }
 
   }
   
   if(circles_id != '' ){
    if(circles_id == 'All'){
        if(role_data.name == 'Admin'){ 
            if(circle_details.length != 0){
                masjid_obj['circles_id'] = {$in:circle_details}
            }
        }else{
            if(acc_circles.length != 0){
                masjid_obj['circles_id'] = {$in:acc_circles}
            }
        }
    }else{
        masjid_obj['circles_id'] = ObjectId(circles_id)
    }

   }
   
   if(area_id != '' ){
    if(area_id == 'All'){
        if(role_data.name == 'Admin'){
                if(area_details.length != 0){
                    masjid_obj['area_id'] =  {$in:area_details}
                }
        }else{ 
                if(acc_areas.length != 0){
                    masjid_obj['area_id'] = {$in:acc_areas}
                }
        }
    }else{
        masjid_obj['area_id'] = ObjectId(area_id)
    }
   
   }

   if(ward_id != '' ){
    if(ward_id == 'All'){
        if(role_data.name == 'Admin'){
                if(ward_details.length != 0){
                    masjid_obj['ward_id'] = {$in:ward_details}
                }
        }else{
                if(acc_wards.length != 0){
                    masjid_obj['ward_id'] = {$in:acc_wards}
                }
        }
       }else{
        masjid_obj['ward_id'] = ObjectId(ward_id)
       }
   
   }
   let total_masjid = await Temple.find(masjid_obj).countDocuments(); 
   let masjid_data  = await Temple.aggregate([
       {
           "$match":masjid_obj
       }, 
       {
           $lookup:{
               from: "operations",       // other table name
               localField: "_id",   // name of users table field
               foreignField: "collection_id", // name of userinfo table field
               as: "info_manhole"         // alias for userinfo table
           }   
       },  
       {   $unwind:"$info_manhole" },   
       {"$match": {"info_manhole.date":date_value}}, 
      
   ])
   final_array_dates.push({date: date_value,attend:masjid_data.length , notattend:total_masjid-masjid_data.length,index:index })
 
}   
    // console.log(satatt_obj)
    // satatt_obj['dates_range'].sort((a, b) => {
    //     return a.index - b.index;
    // });

    

   /* For loop end */
    })); 
        final_array_dates.sort((a, b) => {
            return a.index - b.index;
        });
          
        final_array_dates.forEach(object => {
        delete object['index'];
        });
       // console.log(final_array_dates); 
       // final_array_dates.push(satatt_obj);  
        if(module_type == 'Sat Vehicle'){ 

          
            filename =year+'-'+month+'-'+date+time+'__Sat_vehicles.xlsx'; 
            const image_path='uploads/excel/vehicles/'; 
            fs.mkdir(image_path, function(err) {});  
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});      
            let folder = image_path+year+'-'+month+'-'+date+'/';      
            path_name = url+'download_excel/'+folder+filename; 
            vehicle_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        } 

        if(module_type == 'Transport Vehicle'){
            filename =year+'-'+month+'-'+date+time+'__Transport_vehicles.xlsx'; 
            const image_path='uploads/excel/vehicles/';
            fs.mkdir(image_path, function(err) {});   
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {}); 
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            transport_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'GVP/BEP'){
           
            filename =year+'-'+month+'-'+date+time+'__Gvpbep.xlsx'; 
            const image_path='uploads/excel/gvpbep/';
            fs.mkdir(image_path, function(err) {});    
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {}); 
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            gvpbep_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Parking'){
            filename =year+'-'+month+'-'+date+time+'__Parking.xlsx'; 
            const image_path='uploads/excel/parking/'; 
            fs.mkdir(image_path, function(err) {});    
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {}); 
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            parking_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);

        }

        if(module_type == 'Open place'){
            filename =year+'-'+month+'-'+date+time+'__Openplace.xlsx'; 
            const image_path='uploads/excel/Openplace/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});    
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            openplace_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename); 
        } 
        
        if(module_type == 'Street Vendor'){
            filename =year+'-'+month+'-'+date+time+'__Streetvendor.xlsx'; 
            const image_path='uploads/excel/Streetvendor/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});    
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            streetvendor_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename); 
        }

        if(module_type == 'Toilet'){
            filename =year+'-'+month+'-'+date+time+'__Toilets.xlsx'; 
            const image_path='uploads/excel/Toilets/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            toilets_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename); 
        }

        if(module_type == 'Bus Stop'){
            filename =year+'-'+month+'-'+date+time+'__Busstop.xlsx'; 
            const image_path='uploads/excel/Busstop/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            busstop_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Tree'){
            filename =year+'-'+month+'-'+date+time+'__Tree.xlsx'; 
            const image_path='uploads/excel/Tree/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            tree_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Manhole'){
            filename =year+'-'+month+'-'+date+time+'__Manhole.xlsx'; 
            const image_path='uploads/excel/Manhole/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            manhole_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Manhole'){
            filename =year+'-'+month+'-'+date+time+'__Manhole.xlsx'; 
            const image_path='uploads/excel/Manhole/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename;
            manhole_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Masjid'){
            filename =year+'-'+month+'-'+date+time+'__Masjid.xlsx'; 
            const image_path='uploads/excel/Masjid/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename; 
            masjid_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Church')
        {
            filename =year+'-'+month+'-'+date+time+'__Church.xlsx'; 
            const image_path='uploads/excel/Church/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename;
            church_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Temple')
        {
            filename =year+'-'+month+'-'+date+time+'__Temple.xlsx'; 
            const image_path='uploads/excel/Temple/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename;
            temple_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Community Hall')
        {
            filename =year+'-'+month+'-'+date+time+'__Community_hall.xlsx'; 
            const image_path='uploads/excel/Community_hall/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename;
            communityhall_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Residential/house')
        {
            filename =year+'-'+month+'-'+date+time+'__Residential_house.xlsx'; 
            const image_path='uploads/excel/Residential_house/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});     
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = 'http://localhost:2000/download_excel/'+folder+filename;   
            residential_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        }

        if(module_type == 'Complex & Building')
        {
            filename =year+'-'+month+'-'+date+time+'__Complex_building.xlsx'; 
            const image_path='uploads/excel/Complex_building/'; 
            fs.mkdir(image_path, function(err) {});     
            fs.mkdir(image_path+year+'-'+month+'-'+date, function(err) {});   
            let folder = image_path+year+'-'+month+'-'+date+'/';    
            path_name = url+'download_excel/'+folder+filename;  
            complex_building_excel(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename);
        } 

        return res.status(200).send({login:true,message:true,module_type:module_type,data:final_array_dates,download_path:path_name});   
    }
      
}


const  vehicle_excel = async (dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
     /* Excel Download */
    let vehicle_obj ={vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']} };  
    if(acc_zones.length != 0){
    vehicle_obj['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
    vehicle_obj['circles_id'] = {$in:acc_circles}
    }
    if(acc_wards.length != 0){
    vehicle_obj['ward_id'] = {$in:acc_wards}
    }
    if(acc_areas.length != 0){
    vehicle_obj['landmark_id'] = {$in:acc_areas}  
    }
   
    const vehicle_details = await Vehicles.find(vehicle_obj,{zone:1,circle:1,wards_no:1,ward_name:1,incharge:1,incharge_mobile_number:1,
        vehicle_registration_number:1,owner_type:1,driver_name:1,driver_number:1,transfer_station:1,vehicle_type:1}).exec(); 
        //console.log(vehicle_details); 
        const final_array_sat = []; 
        await Promise.all(vehicle_details.map( async(details,index)=>{
                    let obj ={zone_name:details.zone,circle_name:details.circle,ward_name:details.wards_no+'-'+details.ward_name,
                            incharge:details.incharge,incharge_mobile:details.incharge_mobile_number,vehicle_registration:details.vehicle_registration_number,
                            owner_type:details.owner_type,driver_name:details.driver_name,transfer_station:details.transfer_station,
                            vehicle_type:details.vehicle_type }
                          console.log(obj.vehicle_registration)
                    await Promise.all(dates_search.map( async(date_value,index)=>{
                            const vehicle_dates = await Vehicle_attendance.find({date:date_value,vehicle_registration_number:obj.vehicle_registration}).exec();
                         //   console.log(vehicle_dates); 
                            // console.log(vehicle_dates[0].attandance);
                        
                           obj[date_value] = String(vehicle_dates[0].attandance)  
                        

                         })); 
                         final_array_sat.push(obj); 
        }));  
        

       const headingColumnNames_sat = [ 
           "Zone",
           "Circle",
           "Ward",
           "Incharge",
           "Incharge mobile",
           "Vehicle Registration",
           "Owner type",
           "Driver name",
           "Transfer Station",
           "Vehicle Type",
       ]
       dates_search.map( async(date_value,index)=>{
        headingColumnNames_sat.push(date_value); 
       }); 
      // console.log(headingColumnNames); 
       //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames_sat.forEach(heading => {
        ws.cell(1, headingColumnIndex++) 
            .string(heading)
    });

    //Write Data in Excel file
    let rowIndex = 2;
    final_array_sat.forEach( record => {
        let columnIndex = 1;
        Object.keys(record ).forEach(columnName =>{
            ws.cell(rowIndex,columnIndex++)
                .string(record [columnName])
        });
        rowIndex++;
    });  
    

    const  image_path='uploads/excel/vehicles/';
    wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);     
}    


const  transport_excel = async (dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    /* Excel Download */
   let vehicle_obj ={vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']} };  
   if(acc_zones.length != 0){
   vehicle_obj['zones_id'] = {$in:acc_zones}
   }
   if(acc_circles.length != 0){
   vehicle_obj['circles_id'] = {$in:acc_circles}
   }
   if(acc_wards.length != 0){
   vehicle_obj['ward_id'] = {$in:acc_wards}
   }
   if(acc_areas.length != 0){
   vehicle_obj['landmark_id'] = {$in:acc_areas}  
   }
  
   const vehicle_details = await Vehicles.find(vehicle_obj,{zone:1,circle:1,wards_no:1,ward_name:1,incharge:1,incharge_mobile_number:1,
       vehicle_registration_number:1,owner_type:1,driver_name:1,driver_number:1,transfer_station:1,vehicle_type:1}).exec(); 
       const final_array_transport = []; 
       await Promise.all(vehicle_details.map( async(details,index)=>{
                   let obj ={zone_name:details.zone,circle_name:details.circle,ward_name:details.wards_no+'-'+details.ward_name,
                           incharge:details.incharge,incharge_mobile:details.incharge_mobile_number,vehicle_registration:details.vehicle_registration_number,
                           owner_type:details.owner_type,driver_name:details.driver_name,transfer_station:details.transfer_station,
                           vehicle_type:details.vehicle_type }
                   await Promise.all(dates_search.map( async(date_value,index)=>{
                           const vehicle_dates = await Vehicle_attendance.find({date:date_value,vehicle_registration_number:obj.vehicle_registration}).exec();
                          // console.log(vehicle_dates[0].attandance);
                       
                          obj[date_value] = String(vehicle_dates[0].attandance) 
                       

                        })); 
                        final_array_transport.push(obj); 
       }));  
       

      const headingColumnNames_transport = [ 
          "Zone",
          "Circle",
          "Ward",
          "Incharge",
          "Incharge mobile",
          "Vehicle Registration",
          "Owner type",
          "Driver name",
          "Transfer Station",
          "Vehicle Type",
      ]
      dates_search.map( async(date_value,index)=>{
        headingColumnNames_transport.push(date_value); 
      }); 
       console.log(headingColumnNames_transport); 
    //   Write Column Title in Excel file
   let headingColumnIndex = 1;
   headingColumnNames_transport.forEach(heading => {  
       ws.cell(1, headingColumnIndex++)
           .string(heading) 
   });

   //Write Data in Excel file
   let rowIndex = 2;
   final_array_transport.forEach( record => {
       let columnIndex = 1;
       Object.keys(record ).forEach(columnName =>{
           ws.cell(rowIndex,columnIndex++)
               .string(record [columnName])
       }); 
       rowIndex++; 
   });  
   const  image_path='uploads/excel/vehicles/';
   wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);     
} 

const  gvpbep_excel = async (dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    /* Excel Download */
    let garbage_obj_0 = {type:{$in : ['Gvp','GVP','Bep','BEP']}  } 
    console.log(acc_zones); 
    if(acc_zones.length != 0){
    garbage_obj_0['zone_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
    garbage_obj_0['circle_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
    garbage_obj_0['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
    garbage_obj_0['ward_id'] = {$in:acc_wards}
    } 
   // console.log(garbage_obj_0);

    const total_gvp_bep = await Gvpbep.aggregate([
        { "$match": garbage_obj_0 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                incharge:1,
                designation:1,
                mobile_number:1,
                type:1
            }
        }
    ]);
    console.log(total_gvp_bep); 
   // console.log(total_g); 
       const final_array_gvp = []; 
   await Promise.all(total_gvp_bep.map( async(val,index)=>{
        var oj ={zone:val.zone,circle:val.circle,ward:val.ward_name,area_name:val.area,landmark_name:val.landmark,
            inchange:val.incharge,designation:val.designation,mobile:val.mobile_number,type:val.type};
      //  await Promise.all(dates_search.map( async(date_value,ind)=>{ 
          for(var i=0; i < dates_search.length; i++){
         let t_count = await Gvepbeptrips.find({latitude:dates_search[i],import_gvp_bep_id:ObjectId(val._id)}).countDocuments();
            console.log(t_count);  
         if(t_count >= 1){
                let t_data = await Gvepbeptrips.find({latitude:dates_search[i],import_gvp_bep_id:val._id},{log_date_created:1}).exec();
                oj[dates_search[i]] = String(t_data[0].log_date_created);
                oj['trips'+i] = String(t_count); 
              //  oj['id'+i] = val._id; 
              
            }  
            if(t_count == 0){
                oj[dates_search[i]] = '';     
                oj['trips'+i] = '0'; 
               // oj['id'+i] = val._id; 
            }

        }
        oj['index'] = index; 
        //})); 
        final_array_gvp.push(oj);  
   }));   
  
   final_array_gvp.sort((a, b) => { 
    return a.index - b.index;
   });

   final_array_gvp.forEach(object => {
    delete object['index'];
    });
//     console.log(final_array);
      const headingColumnNames_gvp = [ 
          "Zone",
          "Circle",
          "Ward",
          "Area",
          "Landmark",
          "Incharge",
          "Designation",
          "Mobile",
          "Type"
      ]
      dates_search.map( async(date_value,index)=>{
        headingColumnNames_gvp.push(date_value); 
        headingColumnNames_gvp.push('Trips'); 
       
      }); 
      console.log(headingColumnNames_gvp); 
//     //   Write Column Title in Excel file
   let headingColumnIndex = 1;
   headingColumnNames_gvp.forEach(heading => { 
       ws.cell(1, headingColumnIndex++)
           .string(heading)
   });

   //Write Data in Excel file
   let rowIndex = 2;
   final_array_gvp.forEach( record => {
       let columnIndex = 1;
       Object.keys(record ).forEach(columnName =>{
           ws.cell(rowIndex,columnIndex++)
               .string(record [columnName])
       }); 
       rowIndex++; 
   });  
   const  image_path='uploads/excel/gvpbep/';
   wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);     
}

const parking_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let complex_building_obj_1 = {}; 
    if(acc_zones.length != 0){
        complex_building_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        complex_building_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        complex_building_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        complex_building_obj_1['ward_id'] = {$in:acc_wards}
    }
    const parking_details = await Parking.aggregate([
        { "$match": complex_building_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                parking_name:1,
                owner_name:1,
                owner_mobile:1,
                address:1,
            }
        }
    ]); 
    
   // console.log(parking_details); 
    const final_array_parking = []; 
    await Promise.all(parking_details.map( async(val,index)=>{
           let parking_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            parking_name: val.parking_name,owner_name:val.owner_name,mobile:val.owner_mobile,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_parking = await Operations.find({date:dates_search[i],db_type:'parkings',collection_id:val._id}).countDocuments(); 
                parking_obj[dates_search[i]] = String(count_parking); 
            }
            parking_obj['index'] = index; 
            final_array_parking.push(parking_obj);
    })); 
       // console.log(final_array); 
       final_array_parking.sort((a, b) => { 
        return a.index - b.index;
       });
    
       final_array_parking.forEach(object => {
        delete object['index'];
        });
        const headingColumnNames_parking = [ 
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Parking",
            "Owner name",
            "Mobile",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{
            headingColumnNames_parking.push(date_value); 
        }); 
    //    console.log(headingColumnNames); 
  //     //   Write Column Title in Excel file
     let headingColumnIndex = 1;
     headingColumnNames_parking.forEach(heading => { 
         ws.cell(1, headingColumnIndex++) 
             .string(heading) 
     });
  
     //Write Data in Excel file 
     let rowIndex = 2; 
     final_array_parking.forEach( record => {
         let columnIndex = 1;
         Object.keys(record ).forEach(columnName =>{
             ws.cell(rowIndex,columnIndex++)
                 .string(record [columnName])
         }); 
         rowIndex++; 
     });  
     const  image_path='uploads/excel/parking/';
     wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);    

}

const openplace_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let complex_building_obj_1 = {}; 
    if(acc_zones.length != 0){
        complex_building_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        complex_building_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        complex_building_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        complex_building_obj_1['ward_id'] = {$in:acc_wards}
    }

   
    const openplace_details = await Openplace.aggregate([
        { "$match": complex_building_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                open_place_name:1,
                incharge_name:1,
                incharge_mobile:1,
                address:1,
            }
        }
    ]); 

   
    const final_array_openplace = []; 
    await Promise.all(openplace_details.map( async(val,index)=>{
           let parking_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            open_place_name: val.open_place_name,incharge_name:val.incharge_name,incharge_mobile:val.incharge_mobile,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_parking = await Operations.find({date:dates_search[i],db_type:"open_places",collection_id:val._id}).countDocuments(); 
                parking_obj[dates_search[i]] = String(count_parking); 
            }
            parking_obj['index'] = index; 
            final_array_openplace.push(parking_obj);
    })); 

    final_array_openplace.sort((a, b) => { 
        return a.index - b.index;
        });
    
        final_array_openplace.forEach(object => {
        delete object['index'];
        }); 

        // console.log(final_array)
        const headingColumnNames_openplace = [ 
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Incharge Name",
            "Incharge Mobile",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{
            headingColumnNames_openplace.push(date_value); 
        });
        console.log(headingColumnNames_openplace); 

        let headingColumnIndex = 1;
        headingColumnNames_openplace.forEach(heading => { 
            ws.cell(1, headingColumnIndex++) 
                .string(heading) 
        });
     
        //Write Data in Excel file 
        let rowIndex = 2; 
        final_array_openplace.forEach( record => {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            }); 
            rowIndex++; 
        });  
        const  image_path='uploads/excel/Openplace/'; 
        wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);  

}

const streetvendor_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let complex_building_obj_1 = {}; 
    if(acc_zones.length != 0){
        complex_building_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        complex_building_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        complex_building_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        complex_building_obj_1['ward_id'] = {$in:acc_wards}
    }
    
    const streetvendor_details = await Street_vendor.aggregate([
        { "$match": complex_building_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                business_name:1,
                owner_name:1,
                owner_mobile:1,
                business_type:1,
            }
        }
    ]); 

    // console.log(streetvendor_details); 
    const final_array_street = []; 
    await Promise.all(streetvendor_details.map( async(val,index)=>{
           let street_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            business_name: val.business_name,owner_name:val.owner_name,owner_mobile:val.owner_mobile,business_type:val.business_type};
            for(var i=0; i < dates_search.length; i++){
                let count_parking = await Operations.find({date:dates_search[i],db_type:"streetvendors",collection_id:val._id}).countDocuments(); 
                street_obj[dates_search[i]] = String(count_parking); 
            }
            street_obj['index'] = index; 
            final_array_street.push(street_obj);
    })); 
    //  console.log(final_array); 
    final_array_street.sort((a, b) => { 
        return a.index - b.index;
        });
        
        final_array_street.forEach(object => {
        delete object['index'];
        }); 

            // console.log(final_array)
            const headingColumnNames_street = [ 
                "Zone",
                "Circle",
                "Ward",
                "Area",
                "Landmark",
                "Business Name",
                "Owner Name",
                "Owner Mobile",
                "Business Type"
            ]
            dates_search.map( async(date_value,index)=>{
                headingColumnNames_street.push(date_value); 
            });
            console.log(headingColumnNames_street); 
            let headingColumnIndex = 1;
            headingColumnNames_street.forEach(heading => { 
                ws.cell(1, headingColumnIndex++) 
                    .string(heading) 
            });
         
            //Write Data in Excel file 
            let rowIndex = 2; 
            final_array_street.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                }); 
                rowIndex++; 
            });  
            const  image_path='uploads/excel/Streetvendor/'; 
            wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);  
}

const toilets_excel      = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let complex_building_obj_1 = {}; 
    if(acc_zones.length != 0){
        complex_building_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        complex_building_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        complex_building_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        complex_building_obj_1['ward_id'] = {$in:acc_wards}
    }
  //  console.log(complex_building_obj_1)
    const toilets_details = await Toilets.aggregate([
        { "$match": complex_building_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                toilet_name:1,
                incharge_name:1,
                incharge_mobile:1,
                address:1,
            }
        }
    ]); 
    
    //  console.log(toilets_details); 
    const final_array_toilets = []; 
    await Promise.all(toilets_details.map( async(val,index)=>{
           let street_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            toilet_name: val.toilet_name,incharge_name:val.incharge_name,incharge_mobile:val.incharge_mobile,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_toilets = await Toiletsoperation.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                street_obj[dates_search[i]] = String(count_toilets); 
            }
            street_obj['index'] = index; 
            final_array_toilets.push(street_obj);
    })); 
        
        final_array_toilets.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_toilets.forEach(object => {
        delete object['index'];
        });  
       
        // console.log(final_array)
        const headingColumnNames_toilet = [  
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Incharge Name",
            "Incharge Mobile",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{
            headingColumnNames_toilet.push(date_value); 
        });
        
        // console.log(headingColumnNames); 
        let headingColumnIndex = 1;
        headingColumnNames_toilet.forEach(heading => { 
            ws.cell(1, headingColumnIndex++) 
                .string(heading) 
        });
     
        //Write Data in Excel file 
        let rowIndex = 2; 
        final_array_toilets.forEach( record => {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            }); 
            rowIndex++; 
        });  
        const  image_path='uploads/excel/Toilets/'; 
        wb.write(image_path+year+'-'+month+'-'+date+'/'+filename); 
}

const busstop_excel   = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let busstop_obj_1 ={type:'Bus Stop'};
    if(acc_zones.length != 0){
        busstop_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        busstop_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        busstop_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        busstop_obj_1['ward_id'] = {$in:acc_wards}
    }

    const busstop_details = await Manhole_tree.aggregate([
        { "$match": busstop_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                man_hole_name:1,
                minor_major:1,
                type:1,
                address:1,
            }
        }
    ]); 

    //  console.log(busstop_details); 
    const final_array_busstop = []; 
    await Promise.all(busstop_details.map( async(val,index)=>{
           let busstop_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            man_hole_name: val.man_hole_name,type:val.type,minor_major:val.minor_major,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_busstop = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                busstop_obj[dates_search[i]] = String(count_busstop); 
            }
            busstop_obj['index'] = index; 
            final_array_busstop.push(busstop_obj);
    })); 
    
    // console.log(final_array_busstop)
    final_array_busstop.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_busstop.forEach(object => {
        delete object['index'];
        });  
       
       //  console.log(final_array_busstop)
        const headingColumnNames_busstop = [  
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Type",
            "Minor or Major",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_busstop.push(date_value); 
        });

           
        // console.log(headingColumnNames); 
        let headingColumnIndex = 1;
        headingColumnNames_busstop.forEach(heading => { 
            ws.cell(1, headingColumnIndex++) 
                .string(heading) 
        });
     
        //Write Data in Excel file 
        let rowIndex = 2; 
        final_array_busstop.forEach( record => {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            }); 
            rowIndex++; 
        });  
        const  image_path='uploads/excel/Busstop/'; 
        wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);   

}

const tree_excel  = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let busstop_obj_1 ={type:'Tree'};
    if(acc_zones.length != 0){
        busstop_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        busstop_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        busstop_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        busstop_obj_1['ward_id'] = {$in:acc_wards}
    }

    const tree_details = await Manhole_tree.aggregate([
        { "$match": busstop_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                man_hole_name:1,
                minor_major:1,
                type:1,
                address:1,
            }
        }
    ]); 

    
    const final_array_tree = []; 
    await Promise.all(tree_details.map( async(val,index)=>{
           let tree_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            man_hole_name: val.man_hole_name,type:val.type,minor_major:val.minor_major,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_busstop = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                tree_obj[dates_search[i]] = String(count_busstop); 
            }
            tree_obj['index'] = index; 
            final_array_tree.push(tree_obj);
    })); 

    final_array_tree.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_tree.forEach(object => {
        delete object['index'];
        });  
       
        // console.log(final_array)
        const headingColumnNames_tree = [  
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Type",
            "Minor or Major",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_tree.push(date_value); 
        });

           
        // console.log(headingColumnNames); 
        let headingColumnIndex = 1;
        headingColumnNames_tree.forEach(heading => { 
            ws.cell(1, headingColumnIndex++) 
                .string(heading) 
        });
     
        //Write Data in Excel file 
        let rowIndex = 2; 
        final_array_tree.forEach( record => {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            }); 
            rowIndex++; 
        });  
        const  image_path='uploads/excel/Tree/'; 
        wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);   
    
}


const manhole_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let busstop_obj_1 ={type:'Man hole'};
    if(acc_zones.length != 0){
        busstop_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        busstop_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        busstop_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        busstop_obj_1['ward_id'] = {$in:acc_wards}
    }

    const manhole_details = await Manhole_tree.aggregate([
        { "$match": busstop_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                man_hole_name:1,
                minor_major:1,
                type:1,
                address:1,
            }
        }
    ]); 

    const final_array_manhole = []; 
    await Promise.all(manhole_details.map( async(val,index)=>{
           let tree_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            man_hole_name: val.man_hole_name,type:val.type,minor_major:val.minor_major,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_busstop = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                tree_obj[dates_search[i]] = String(count_busstop); 
            }
            tree_obj['index'] = index; 
            final_array_manhole.push(tree_obj);
    })); 

   
    final_array_manhole.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_manhole.forEach(object => {
        delete object['index'];
        });  
       
        // console.log(final_array)
        const headingColumnNames_manhole = [  
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Type",
            "Minor or Major",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_manhole.push(date_value); 
        });

           
        // console.log(headingColumnNames); 
        let headingColumnIndex = 1;
        headingColumnNames_manhole.forEach(heading => { 
            ws.cell(1, headingColumnIndex++) 
                .string(heading) 
        });
     
        //Write Data in Excel file 
        let rowIndex = 2; 
        final_array_manhole.forEach( record => {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            }); 
            rowIndex++; 
        });  
        const  image_path='uploads/excel/Manhole/'; 
        wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);   

}

const masjid_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let temple_obj_1 ={type:'Masjid'};
    if(acc_zones.length != 0){
        temple_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        temple_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        temple_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        temple_obj_1['ward_id'] = {$in:acc_wards}
    }

    const masjid_details = await Temple.aggregate([
        { "$match": temple_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                temple_name:1,
                incharge_name:1,
                incharge_mobile:1,
                address:1,
            }
        }
    ]); 

     console.log(masjid_details); 

    const final_array_masjid = []; 
    await Promise.all(masjid_details.map( async(val,index)=>{
           let masjid_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            temple_name: val.temple_name,incharge_name:val.incharge_name,incharge_mobile:val.incharge_mobile,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_masjid = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                masjid_obj[dates_search[i]] = String(count_masjid); 
            }
            masjid_obj['index'] = index; 
            final_array_masjid.push(masjid_obj);
    })); 

    // console.log(final_array);
    final_array_masjid.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_masjid.forEach(object => {
        delete object['index'];
        });  
       
        // console.log(final_array)
        const headingColumnNames_masjid = [  
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Incharge Name",
            "Incharge Mobile",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_masjid.push(date_value); 
        });
        
           // console.log(headingColumnNames); 
           let headingColumnIndex = 1;
           headingColumnNames_masjid.forEach(heading => { 
               ws.cell(1, headingColumnIndex++) 
                   .string(heading) 
           });
        
           //Write Data in Excel file 
           let rowIndex = 2; 
           final_array_masjid.forEach( record => {
               let columnIndex = 1;
               Object.keys(record ).forEach(columnName =>{
                   ws.cell(rowIndex,columnIndex++)
                       .string(record [columnName])
               }); 
               rowIndex++; 
           });  
           const  image_path='uploads/excel/Masjid/'; 
           wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);  
}


const church_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let temple_obj_1 ={type:'Church'};
    if(acc_zones.length != 0){
        temple_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        temple_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        temple_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        temple_obj_1['ward_id'] = {$in:acc_wards}
    }

    const church_details = await Temple.aggregate([
        { "$match": temple_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                temple_name:1,
                incharge_name:1,
                incharge_mobile:1,
                address:1,
            }
        }
    ]); 

   
      const final_array_church = []; 
      await Promise.all(church_details.map( async(val,index)=>{
             let masjid_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
              temple_name: val.temple_name,incharge_name:val.incharge_name,incharge_mobile:val.incharge_mobile,address:val.address};
              for(var i=0; i < dates_search.length; i++){
                  let count_masjid = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                  masjid_obj[dates_search[i]] = String(count_masjid); 
              }
              masjid_obj['index'] = index; 
              final_array_church.push(masjid_obj);
      })); 
  
      // console.log(final_array);
      final_array_church.sort((a, b) => { 
          return a.index - b.index;
          });
         
          final_array_church.forEach(object => {
          delete object['index'];
          });  
         
          // console.log(final_array)
          const headingColumnNames_church = [  
              "Zone",
              "Circle",
              "Ward",
              "Area",
              "Landmark",
              "Name",
              "Incharge Name",
              "Incharge Mobile",
              "Address"
          ]
          dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_church.push(date_value); 
          });
          
             // console.log(headingColumnNames); 
             let headingColumnIndex = 1;
             headingColumnNames_church.forEach(heading => { 
                 ws.cell(1, headingColumnIndex++) 
                     .string(heading) 
             });
          
             //Write Data in Excel file 
             let rowIndex = 2; 
             final_array_church.forEach( record => {
                 let columnIndex = 1;
                 Object.keys(record ).forEach(columnName =>{
                     ws.cell(rowIndex,columnIndex++)
                         .string(record [columnName])
                 }); 
                 rowIndex++; 
             });  
             const  image_path='uploads/excel/Church/'; 
             wb.write(image_path+year+'-'+month+'-'+date+'/'+filename); 

}

const temple_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let temple_obj_1 ={type:'Temple'};
    if(acc_zones.length != 0){
        temple_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        temple_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        temple_obj_1['area_id'] =  {$in:acc_areas}
    }
    if(acc_wards.length != 0){
        temple_obj_1['ward_id'] = {$in:acc_wards}
    }

    const temple_details = await Temple.aggregate([
        { "$match": temple_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                temple_name:1,
                incharge_name:1,
                incharge_mobile:1,
                address:1,
            }
        }
    ]); 

    const final_array_temple = []; 
    await Promise.all(temple_details.map( async(val,index)=>{
           let masjid_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            temple_name: val.temple_name,incharge_name:val.incharge_name,incharge_mobile:val.incharge_mobile,address:val.address};
            for(var i=0; i < dates_search.length; i++){
                let count_masjid = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                masjid_obj[dates_search[i]] = String(count_masjid); 
            }
            masjid_obj['index'] = index; 
            final_array_temple.push(masjid_obj);
    })); 

    // console.log(final_array);
    final_array_temple.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_temple.forEach(object => {
        delete object['index'];
        });  
       
        // console.log(final_array)
        const headingColumnNames_temple = [  
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Name",
            "Incharge Name",
            "Incharge Mobile",
            "Address"
        ]
        dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_temple.push(date_value); 
        });
        
           // console.log(headingColumnNames); 
           let headingColumnIndex = 1;
           headingColumnNames_temple.forEach(heading => { 
               ws.cell(1, headingColumnIndex++) 
                   .string(heading) 
           });
        
           //Write Data in Excel file 
           let rowIndex = 2; 
           final_array_temple.forEach( record => {
               let columnIndex = 1;
               Object.keys(record ).forEach(columnName =>{
                   ws.cell(rowIndex,columnIndex++)
                       .string(record [columnName])
               }); 
               rowIndex++; 
           });  
           const  image_path='uploads/excel/Temple/'; 
           wb.write(image_path+year+'-'+month+'-'+date+'/'+filename); 

}

const communityhall_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let community_obj_1 ={};
    if(acc_zones.length != 0){
        community_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        community_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        community_obj_1['area_id'] =  {$in:acc_areas}  
    }
    if(acc_wards.length != 0){
        community_obj_1['ward_id'] = {$in:acc_wards}
    }

    const community_details = await Community_hall.aggregate([
        { "$match": community_obj_1 }, 
        
        {
            $project:{ 
                _id : 1,
                zone:1,
                circle:1,
                ward_name:1,
                area:1,
                landmark:1,
                owner_name:1,
                owner_mobile:1,
                licence_number:1,
            }
        }
    ]); 
    
    console.log(community_details);  
    const final_array_community = []; 
    await Promise.all(community_details.map( async(val,index)=>{
           let community_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
            owner_name: val.owner_name,owner_mobile:val.owner_mobile,licence_number:val.licence_number};
            for(var i=0; i < dates_search.length; i++){
                let count_masjid = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                community_obj[dates_search[i]] = String(count_masjid); 
            }
            community_obj['index'] = index; 
            final_array_community.push(community_obj);
    })); 

     // console.log(final_array);
     final_array_community.sort((a, b) => { 
        return a.index - b.index;
        });
       
        final_array_community.forEach(object => {
        delete object['index'];
        });  
       
        // console.log(final_array)
        const headingColumnNames = [   
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Owner Name",
            "Owner Mobile",
            "Licence number"
        ]
        dates_search.map( async(date_value,index)=>{ 
          headingColumnNames.push(date_value); 
        });
        
           // console.log(headingColumnNames); 
           let headingColumnIndex = 1;
           headingColumnNames.forEach(heading => { 
               ws.cell(1, headingColumnIndex++) 
                   .string(heading) 
           });
        
           //Write Data in Excel file 
           let rowIndex = 2; 
           final_array_community.forEach( record => {
               let columnIndex = 1;
               Object.keys(record ).forEach(columnName =>{
                   ws.cell(rowIndex,columnIndex++)
                       .string(record [columnName])
               }); 
               rowIndex++; 
           });  
           const  image_path='uploads/excel/Community_hall/';  
           wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);   
}

const residential_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
        let residential_obj_1 ={};
        if(acc_zones.length != 0){
            residential_obj_1['zones_id'] = {$in:acc_zones}
        }
        if(acc_circles.length != 0){
            residential_obj_1['circles_id'] = {$in:acc_circles}
        }
        if(acc_areas.length != 0){
            residential_obj_1['area_id'] =  {$in:acc_areas}  
        }
        if(acc_wards.length != 0){
            residential_obj_1['ward_id'] = {$in:acc_wards}
        }

        const residential_details = await Residential_house.aggregate([
            { "$match": residential_obj_1 }, 
            
            {
                $project:{ 
                    _id : 1,
                    zone:1,
                    circle:1,
                    ward_name:1,
                    area:1,
                    landmark:1,
                    owner_name:1,
                    owner_mobile:1,
                    house_address:1,
                }
            }
        ]);
    
        // console.log(residential_details); 
        const final_array_residential = []; 
        await Promise.all(residential_details.map( async(val,index)=>{
            let residential_obj ={zone_name:val.zone,circle_name:val.circle,ward_name:val.ward_name,area_name:val.area,landmark:val.landmark,
                owner_name: val.owner_name,owner_mobile:val.owner_mobile,house_address:val.house_address};
                for(var i=0; i < dates_search.length; i++){
                    let count_residential = await Operations.find({date:dates_search[i],collection_id:val._id}).countDocuments(); 
                    residential_obj[dates_search[i]] = String(count_residential); 
                }
                residential_obj['index'] = index; 
                final_array_residential.push(residential_obj);   
        })); 
 
        // console.log(final_array);
        final_array_residential.sort((a, b) => {   
        return a.index - b.index;
        }); 
       
        final_array_residential.forEach(object => {  
        delete object['index'];
        });  
       
        //  console.log(final_array)
        const headingColumnNames_residential = [   
            "Zone",
            "Circle",
            "Ward",
            "Area",
            "Landmark",
            "Owner Name",
            "Owner Mobile",
            "Licence number"
        ]
        dates_search.map( async(date_value,index)=>{ 
            headingColumnNames_residential.push(date_value); 
        });
  
            //  console.log(headingColumnNames); 
             let headingColumnIndex = 1;
             headingColumnNames_residential.forEach(heading => { 
                 ws.cell(1, headingColumnIndex++) 
                     .string(heading) 
             });
          
             //Write Data in Excel file 
             let rowIndex = 2; 
             final_array_residential.forEach( record => {
                 let columnIndex = 1;
                 Object.keys(record ).forEach(columnName =>{
                     ws.cell(rowIndex,columnIndex++)
                         .string(record [columnName])
                 }); 
                 rowIndex++; 
             });   
             const  image_path='uploads/excel/Residential_house/';  
             wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);       

}

const complex_building_excel = async(dates_search,acc_zones,acc_circles,acc_areas,acc_wards,year,month,date,filename)=>{
    let complex_obj_1 ={};
    if(acc_zones.length != 0){
        complex_obj_1['zones_id'] = {$in:acc_zones}
    }
    if(acc_circles.length != 0){
        complex_obj_1['circles_id'] = {$in:acc_circles}
    }
    if(acc_areas.length != 0){
        complex_obj_1['area_id'] =  {$in:acc_areas}  
    }
    if(acc_wards.length != 0){
        complex_obj_1['ward_id'] = {$in:acc_wards}
    }

    const complex_details = await Complex_building.aggregate([
        { "$match" : complex_obj_1 },
        {
            $project : {
                _id       : 1,
                zone      : 1,
                circle    : 1,
                ward_name : 1,
                landmark  : 1,
                name      : 1,
                floors    : 1, 
                address   : 1
            }
        }
    ]);

    // console.log(complex_details); 
    const final_array_complex = [];
    await Promise.all(complex_details.map(async(val,index)=>{
                let complex_obj ={zone_name: val.zone,circle_name: val.circle, ward_name:val.ward_name, landmark_name:val.landmark,
                  name: val.name,floors:val.floors,address:val.address};
                for(var i=0; i< dates_search.length; i++)
                {
                    const count_complex = await Operations.find({date:dates_search[i], collection_id:val._id}).countDocuments();
                    //console.log(count_complex);
                    complex_obj[dates_search[i]] = String(count_complex);
                }
                complex_obj['index'] = index;
                final_array_complex.push(complex_obj); 
    }))

    //  console.log(final_array)
    final_array_complex.sort((a,b)=>{
        return a.index - b.index; 
    })

    final_array_complex.forEach((object)=>{
        delete object['index']
    })

    //  console.log(final_array);  
    const headingColumnNames_complex = ['Zone','Circle','Ward','Landmark','Name','Floor','Address'];

    dates_search.map(async(val)=>{
        headingColumnNames_complex.push(val);
    })

     console.log(headingColumnNames_complex); 
    
      //  console.log(headingColumnNames); 
      let headingColumnIndex = 1;
      headingColumnNames_complex.forEach(heading => { 
          ws.cell(1, headingColumnIndex++) 
              .string(heading) 
      });
   
      //Write Data in Excel file 
      let rowIndex = 2; 
      final_array_complex.forEach( record => {
          let columnIndex = 1;
          Object.keys(record ).forEach(columnName =>{
              ws.cell(rowIndex,columnIndex++)
                  .string(record [columnName])
          }); 
          rowIndex++; 
      });   
      const  image_path='uploads/excel/Complex_building/';  
      wb.write(image_path+year+'-'+month+'-'+date+'/'+filename);  
    
}

exports.download_excel = async(req,res)=>{
    var upload = req.params['upload'];  
    var excel  = req.params['excel'];   
    var type   = req.params['type'];    
    var year   = req.params['year']; 
    var name   = req.params['name']; 
    const path = upload+'/'+excel+'/'+type+'/'+year+'/'+name;
    res.download(path)
    console.log('donwloaded') 
}

exports.download_excle_dashboard = async(req,res)=>{
    var name = req.params['name'];  
    var user_id = req.params['user_id'];  
    var tenent_id = req.params['tenent_id'];
    let current_datetime = new Date(); 
    let s = new String(current_datetime.getDate()); 
    let cd; 	
    if(s.length == 1){
        cd = '0'+s; 
    }else{
        cd = current_datetime.getDate(); 
    } 
    let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +cd;

    if(name == 'Sat_Vehicle')
    {
        let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
        let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
        let vehicle_details;  
        if(role_data.name == 'Admin'){
            vehicle_details = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},tenent_id:ObjectId(tenent_id) }).exec(); 
        }else{
            console.log('not admin')
            const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
            //  console.log(access_data); 
                      let acc_zones = [];
                      let acc_circles = []; 
                      let acc_wards = []; 
                      let acc_areas = []; 
                      let acc_landmark = []; 
                      acc_zones = access_data['zones'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_circles = access_data['circles'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_wards = access_data['ward'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_areas = access_data['areas'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_landmark = access_data['landmarks'].map((val)=>{
                          return ObjectId(val)
                      })
                    //  console.log();
                      let newobject = {}; 
                     // newobject.date = '2021-11-23'; 
                      newobject.zones_id = {$in: acc_zones};
                      newobject.circles_id = {$in: acc_circles};
                      newobject.ward_id = {$in: acc_wards};
                    //  newobject.areas_id = {$in: acc_areas};
                      newobject.landmark_id = {$in: acc_landmark}; 
                     
                      vehicle_details = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']} }).exec(); 
        }
        // console.log(vehicle_details); 
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Sat Vehicle");


        worksheet.columns = [
            { header: "Zone", key: "zone", width: 15 },
            { header: "Circle", key: "circle", width: 15 },
            { header: "Ward", key: "ward_name", width: 15 },
            { header: "Area", key: "location", width: 15 },
            { header: "SFA name", key: "sfa_name", width: 15 },
            { header: "Registration number", key: "vehicle_registration_number", width: 15 },
            { header: "Owner type", key: "owner_type", width: 15 },
            { header: "Vehicle type", key: "vehicle_type", width: 15 },
            { header: "Attandance", key: "attandance", width: 15 },
            
            ]
            worksheet.addRows(vehicle_details);
                        
            res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "sat_vehicle.xlsx"
            );

            return workbook.xlsx.write(res).then(function () {
                console.log('completed')
                res.status(200).end();
                });

    }

    if(name == 'Transport_Vehicle')
    {
        let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
        let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
        let vehicle_details;  
        if(role_data.name == 'Admin'){
            vehicle_details = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},tenent_id:ObjectId(tenent_id) }).exec(); 
        }else{
            console.log('not admin')
            const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
            //  console.log(access_data); 
                      let acc_zones = [];
                      let acc_circles = []; 
                      let acc_wards = []; 
                      let acc_areas = []; 
                      let acc_landmark = []; 
                      acc_zones = access_data['zones'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_circles = access_data['circles'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_wards = access_data['ward'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_areas = access_data['areas'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_landmark = access_data['landmarks'].map((val)=>{
                          return ObjectId(val)
                      })
                    //  console.log();
                      let newobject = {}; 
                     // newobject.date = '2021-11-23'; 
                      newobject.zones_id = {$in: acc_zones};
                      newobject.circles_id = {$in: acc_circles};
                      newobject.ward_id = {$in: acc_wards};
                    //  newobject.areas_id = {$in: acc_areas};
                      newobject.landmark_id = {$in: acc_landmark}; 
                     
                      vehicle_details = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']} }).exec(); 
        }
        // console.log(vehicle_details); 
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Tranport Vehicle");


        worksheet.columns = [
            { header: "Zone", key: "zone", width: 15 },
            { header: "Circle", key: "circle", width: 15 },
            { header: "Ward", key: "ward_name", width: 15 },
            { header: "Area", key: "location", width: 15 },
            { header: "SFA name", key: "sfa_name", width: 15 },
            { header: "Registration number", key: "vehicle_registration_number", width: 15 },
            { header: "Owner type", key: "owner_type", width: 15 },
            { header: "Vehicle type", key: "vehicle_type", width: 15 },
            { header: "Attandance", key: "attandance", width: 15 },
            
            ]
            worksheet.addRows(vehicle_details);
                        
            res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "transport_vehicle.xlsx"
            );

            return workbook.xlsx.write(res).then(function () {
                console.log('completed')
                res.status(200).end();
                });

    }

    if(name == 'Gvpbep')
    {
        let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
        let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
        let gvp_details;  
        if(role_data.name == 'Admin'){

             gvp_details = await Gvpbep.aggregate([
                { "$match": {type: {$in:['Gvp','GVP', 'Bep','BEP']} , tenent_id:tenent_id} }, 
                
                {
                    $project:{ 
                        _id : 1,
                        type:1,
                        zone:1,
                        circle:1,
                        ward_name:1,
                    }
                }
            ]);

            async function processtrips(data){
                let finalarr = []; 
                await Promise.all(gvp_details.map( async(val,dind)=>{
                    var oj ={zone:val.zone,circle:val.circle,ward:val.ward_name,type:val.type};
                    let t_count = await Gvepbeptrips.find({latitude:formatted_date,import_gvp_bep_id:val._id}).countDocuments();
                    if(t_count >= 1){
                        let t_data = await Gvepbeptrips.find({latitude:formatted_date,import_gvp_bep_id:val._id},{log_date_created:1}).find();
                        oj['trips'] = t_count; 
                        oj['created_date'] = t_data[0].log_date_created;
                    }
                    if(t_count == 0){
                        oj['trips'] = 0; 
                        oj['created_date'] = '--'; 
                    }
                    finalarr.push(oj);    
                }))
                return finalarr; 
            }

            let userToken = processtrips(1);
    //  console.log(alldata); 
        userToken.then(async function(result) { 
          //  console.log(result) // "Some User token"
          let workbook = new excel.Workbook();
          let worksheet = workbook.addWorksheet("Gvpbep");
          worksheet.columns = [
            { header: "Zone", key: "zone", width: 15 },
            { header: "Circle", key: "circle", width: 15 },
            { header: "Ward", key: "ward", width: 15 },
            { header: "Type", key: "type", width: 15 },
            { header: "Trips", key: "trips", width: 15 },
            { header: "Date & Time", key: "created_date", width: 15 }
          ]
          worksheet.addRows(result);
            
                res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "gvpbep.xlsx"
                );
            
                return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
                });
           
        })  


        }else{
            const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
            //  console.log(access_data); 
                      let acc_zones = [];
                      let acc_circles = []; 
                      let acc_wards = []; 
                      let acc_areas = []; 
                      let acc_landmark = []; 
                      acc_zones = access_data['zones'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_circles = access_data['circles'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_wards = access_data['ward'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_areas = access_data['areas'].map((val)=>{
                          return ObjectId(val)
                      })
                      acc_landmark = access_data['landmarks'].map((val)=>{
                          return ObjectId(val)
                      })
                    //  console.log();
                      let newobject = {}; 
                     // newobject.date = '2021-11-23'; 
                      newobject.zones_id = {$in: acc_zones};
                      newobject.circles_id = {$in: acc_circles};
                      newobject.ward_id = {$in: acc_wards};
                      newobject.area_id = {$in: acc_areas}; 
                      newobject.type ={$in:['Gvp','GVP', 'Bep','BEP']}; 
                      newobject.tenent_id = tenent_id; 
                      gvp_details = await Gvpbep.aggregate([
                        { "$match": newobject }, 
                        
                        {
                            $project:{ 
                                _id : 1,
                                type:1,
                                zone:1,
                                circle:1,
                                ward_name:1,
                            }
                        }
                    ]);
        
                    async function processtrips(data){
                        let finalarr = []; 
                        await Promise.all(gvp_details.map( async(val,dind)=>{
                            var oj ={zone:val.zone,circle:val.circle,ward:val.ward_name,type:val.type};
                            let t_count = await Gvepbeptrips.find({date:formatted_date,import_gvp_bep_id:val._id}).countDocuments();
                            if(t_count >= 1){
                                let t_data = await Gvepbeptrips.find({date:formatted_date,import_gvp_bep_id:val._id},{log_date_created:1}).find();
                                oj['trips'] = t_count; 
                                oj['created_date'] = t_data[0].log_date_created;  
                            }
                            if(t_count == 0){
                                oj['trips'] = 0; 
                                oj['created_date'] = '--'; 
                            }
                            finalarr.push(oj);    
                        }))
                        return finalarr; 
                    }
        
                    let userToken = processtrips(1);
            //  console.log(alldata); 
                userToken.then(async function(result) { 
                  //  console.log(result) // "Some User token"
                  let workbook = new excel.Workbook();
                  let worksheet = workbook.addWorksheet("Gvpbep");
                  worksheet.columns = [
                    { header: "Zone", key: "zone", width: 15 },
                    { header: "Circle", key: "circle", width: 15 },
                    { header: "Ward", key: "ward", width: 15 },
                    { header: "Type", key: "type", width: 15 },
                    { header: "Trips", key: "trips", width: 15 },
                    { header: "Date & Time", key: "created_date", width: 15 }
                  ]
                  worksheet.addRows(result);
                    
                        res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        );
                        res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + "gvpbep.xlsx"
                        );
                    
                        return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                        });
                   
                })  
        
                      
        }
    }

    // if(name == 'Complex & Building')
    // {
    //     let acc_dep_data    = await User.findOne({_id:user_id},{department_id:1,user_access_id:1}).exec(); 
    //     let role_data       = await Department.findOne({_id : acc_dep_data.department_id},{name:1});
    //     let complex_details;  
    //     if(role_data.name == 'Admin'){

    //     }
    // }



}

exports.allmoduleslist = async(req,res)=>{

    const modules_list =[{name: 'Sat Vehicle'},{name:'Transport Vehicle'},{name:'GVP/BEP'},{name:'Complex & Building'},
    {name:'Residential/house'},{name:'Community Hall'},{name:'Temple'},{name:'Church'},{name:'Masjid'},{name:'Manhole'},{name:'Tree'},
    {name:'Bus Stop'},{name: 'Toilet'},{name:'Street Vendor'},{name:'Open place'},{name:'Parking'}]
       return res.status(200).send({login:true,success:true,data:modules_list})
}