const User = require('../../model/users'); 
const Department = require('../../model/department'); 
const Vehicle_attendance = require('../../model/vehicles_attandance'); 
const Gvepbeptrips = require('../../model/garbagetrips'); 
const Gvpbep = require('../../model/gvpbep'); 
const Complex_building = require('../../model/complex_building'); 
const Operations = require('../../model/operations'); 
const Residential_house = require('../../model/residential_house'); 
const Street_vendor     = require('../../model/streetvendor'); 
const Community_hall    = require('../../model/communityhall');
const Toilets           = require('../../model/toilets'); 
const Toiletsoperation  = require('../../model/toilets_operations');
const Parking           = require('../../model/parking'); 
const Manhole_tree      = require('../../model/man_hole_tree_busstop');
const Temple            = require('../../model/temple'); 
const Useraccess        = require('../../model/useraccess'); 
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;



exports.all_modules_dashboard = async(req,res)=>{
        const { user_id,tenent_id } = req.body; 
        if(user_id == '' || user_id == undefined){
            return res.status(200).send({login:true,success:false,message:'User id is required'})
        }
        if(tenent_id == '' || tenent_id == undefined){
            return res.status(200).send({login:true,success:false,message:'Tenent id is required'})
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
  //  let formatted_date =   '2021-12-05';
    
  if(role_data.name == 'Admin'){
    console.log('Admin'); 
    let final_array = []; 
    let data_array = []; 
    let sat_attend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    final_array.push({name:'Sat Vehicle',value:sat_attend,type:'Attend'})
    
    let sat_notattend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    final_array.push({name:'Sat Vehicle',value:sat_notattend,type:'Not-Attend'});


    data_array.push({"name":'Sat Vehicle',"attend":sat_attend,"not_attend":sat_notattend});
  
    let transport_attend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    final_array.push({name:'Transport Vehicle',value:transport_attend,type:'Attend'})

    let transport_notattend = await Vehicle_attendance.find({date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0,tenent_id:ObjectId(tenent_id) }).countDocuments(); 
    final_array.push({name:'Transport Vehicle',value:transport_notattend,type:'Not-Attend'})


    data_array.push({"name":'Transport Vehicle',"attend":transport_attend,"not_attend":transport_notattend});

    let gvp_attend = await Gvepbeptrips.find({date:formatted_date,type:{$in : ['Gvp','GVP','Bep','BEP']},tenent_id:tenent_id  }).countDocuments();
    final_array.push({name:'Gvpbep',value:gvp_attend,type:'Attend'})
    
    let gvp_total = await Gvpbep.find({tenent_id:tenent_id}).countDocuments(); 
    final_array.push({name:'Gvpbep',value:gvp_total - gvp_attend,type:'Not-Attend'});  
    
    data_array.push({"name":'Gvpbep',"attend":gvp_attend,"not_attend":gvp_total - gvp_attend});

    let total_complex = await Complex_building.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let complex_attend =  await Operations.find({date:formatted_date,db_type:'comercial_buildings',tenent_id:ObjectId(tenent_id)}).countDocuments();
    final_array.push({name:'Comercial Building',value:complex_attend,type:'Attend'});
    final_array.push({name:'Comercial Building',value:total_complex-complex_attend,type:'Not-Attend'});


    data_array.push({"name":'Comercial Building',"attend":complex_attend,"not_attend":total_complex-complex_attend});
    
    let total_residential = await Residential_house.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let residential_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'residential_houses'}).countDocuments();
    final_array.push({name:'Residential House',value:residential_attend,type:'Attend'});
    final_array.push({name:'Residential House',value:total_residential-residential_attend,type:'Not-Attend'});

    data_array.push({"name":'Residential House',"attend":residential_attend,"not_attend":total_residential-residential_attend});
 
    let total_street = await Street_vendor.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let street_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'streetvendors'}).countDocuments();
    final_array.push({name:'Street vendor',value:street_attend,type:'Attend'});
    final_array.push({name:'Street vendor',value:total_street-street_attend,type:'Not-Attend'}); 

    data_array.push({"name":'Street vendor',"attend":street_attend,"not_attend":total_street-street_attend});

    let total_communityhall = await Community_hall.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let community_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'communityhalls'}).countDocuments();
    final_array.push({name:'Community hall',value:community_attend,type:'Attend'});
    final_array.push({name:'Community hall',value:total_communityhall-community_attend,type:'Not-Attend'});


    data_array.push({"name":'Community hall',"attend":community_attend,"not_attend":total_communityhall-community_attend});

   
    let total_toilets = await Toilets.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let toilets_attend =  await Toiletsoperation.find({tenent_id:ObjectId(tenent_id),date:formatted_date}).countDocuments();
    final_array.push({name:'Toilets',value:toilets_attend,type:'Attend'});
    final_array.push({name:'Toilets',value:total_toilets-toilets_attend,type:'Not-Attend'});

    data_array.push({"name":'Toilets',"attend":toilets_attend,"not_attend":total_toilets-toilets_attend});

    let total_parking = await Parking.find({tenent_id:ObjectId(tenent_id)}).countDocuments(); 
    let parking_attend =  await Operations.find({tenent_id:ObjectId(tenent_id),date:formatted_date,db_type:'parkings'}).countDocuments();
    final_array.push({name:'Parking',value:parking_attend,type:'Attend'});
    final_array.push({name:'Parking',value:total_parking-parking_attend,type:'Not-Attend'});

    data_array.push({"name":'Parking',"attend":parking_attend,"not_attend":total_parking-parking_attend});

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
    ]);
    

  //  console.log(total_manhole); 
   // console.log(manhole_data.length); 
    final_array.push({name:'Man hole',value:manhole_data.length,type:'Attend'});
    final_array.push({name:'Man hole',value:total_manhole-manhole_data.length,type:'Not-Attend'});

    data_array.push({"name":'Man hole',"attend":manhole_data.length,"not_attend":total_manhole-manhole_data.length});


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
    final_array.push({name:'Tree',value:tree_data.length,type:'Attend'});
    final_array.push({name:'Tree',value:total_tree-tree_data.length,type:'Not-Attend'});

    data_array.push({"name":'Man hole',"attend":tree_data.length,"not_attend":total_tree-tree_data.length});

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

    final_array.push({name:'Bus Stop',value:busstop_data.length,type:'Attend'});
    final_array.push({name:'Bus Stop',value:total_busstop-busstop_data.length,type:'Not-Attend'});
    data_array.push({"name":'Bus Stop',"attend":busstop_data.length,"not_attend":total_busstop-busstop_data.length});

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

    final_array.push({name:'Temple',value:temple_data.length,type:'Attend'});
    final_array.push({name:'Temple',value:total_temple-temple_data.length,type:'Not-Attend'});

    data_array.push({"name":'Temple',"attend":temple_data.length,"not_attend":total_temple-temple_data.length});

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

    final_array.push({name:'Church',value:church_data.length,type:'Attend'});
    final_array.push({name:'Church',value:total_church-church_data.length,type:'Not-Attend'});

    data_array.push({"name":'Church',"attend":church_data.length,"not_attend":total_church-church_data.length});

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
    final_array.push({name:'Masjid',value:masjid_data.length,type:'Attend'});
    final_array.push({name:'Masjid',value:total_masjid-masjid_data.length,type:'Not-Attend'});
    data_array.push({"name":'Masjid',"attend":masjid_data.length,"not_attend":total_masjid-masjid_data.length});
    return res.status(200).send({login:true,success:true,data: final_array,data_array:data_array}); 
   }
   else{
    const access_data = await Useraccess.findOne({_id:acc_dep_data.user_access_id}).exec()
            let data_array = [];
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
            console.log();
            let newobject = {}; 
           // newobject.date = '2021-11-23'; 
            newobject.zones_id = {$in: acc_zones};
            newobject.circles_id = {$in: acc_circles};
            newobject.ward_id = {$in: acc_wards};
            newobject.areas_id = {$in: acc_areas};
            newobject.landmark_id = {$in: acc_landmark}; 
            
            let final_array = [];  

            let sat_attend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards} ,
                landmark_id: {$in: acc_landmark},date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1 }).countDocuments(); 
            final_array.push({name:'Sat Vehicle',value:sat_attend,type:'Attend'})
            
            let sat_notattend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards} ,
                landmark_id: {$in: acc_landmark},date:formatted_date,vehicle_type:{$in:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0 }).countDocuments(); 
            final_array.push({name:'Sat Vehicle',value:sat_notattend,type:'Not-Attend'});

            data_array.push({"name":'Sat Vehicle',"attend":sat_attend,"not_attend":sat_notattend});
        
            let transport_attend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards} ,
                landmark_id: {$in: acc_landmark},date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:1 }).countDocuments(); 
            final_array.push({name:'Transport Vehicle',value:transport_attend,type:'Attend'})
        
            let transport_notattend = await Vehicle_attendance.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards} ,
                landmark_id: {$in: acc_landmark},date:formatted_date,vehicle_type:{$nin:['GHMC Swatch Auto', 'Private Swatch Auto']},attandance:0 }).countDocuments(); 
            final_array.push({name:'Transport Vehicle',value:transport_notattend,type:'Not-Attend'})

            data_array.push({"name":'Transport Vehicle',"attend":transport_attend,"not_attend":transport_notattend});
        
            let gvp_attend = await Gvepbeptrips.find({zone_id:{$in: acc_zones},circle_id:{$in: acc_circles},ward_id:{$in: acc_wards},landmark_id:{$in: acc_landmark} ,date:formatted_date,type:{$in : ['Gvp','GVP','Bep','BEP']}  }).countDocuments();
            final_array.push({name:'Gvpbep',value:gvp_attend,type:'Attend'})
            
            let gvp_total = await Gvpbep.find({zone_id:{$in: acc_zones},circle_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments();
            final_array.push({name:'Gvpbep',value:gvp_total - gvp_attend,type:'Not-Attend'});
            
            
            data_array.push({"name":'Gvpbep',"attend":gvp_attend,"not_attend":gvp_total - gvp_attend});
            
            let total_complex = await Complex_building.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},
                ward_id:{$in: acc_wards},area_id: {$in: acc_areas}, landmark_id: {$in: acc_landmark} }).countDocuments(); 
           
            let complex_attend =  await Operations.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date,db_type:'comercial_buildings' }).countDocuments();
            
            final_array.push({name:'Comercial Building',value:complex_attend,type:'Attend'});
            final_array.push({name:'Comercial Building',value:total_complex-complex_attend,type:'Not-Attend'});

            data_array.push({"name":'Comercial Building',"attend":complex_attend,"not_attend":total_complex-complex_attend});
            
            let total_residential = await Residential_house.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}   }).countDocuments(); 
            
            let residential_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date,db_type:'residential_houses'}).countDocuments();
            final_array.push({name:'Residential House',value:residential_attend,type:'Attend'});
            final_array.push({name:'Residential House',value:total_residential-residential_attend,type:'Not-Attend'});

            data_array.push({"name":'Residential House',"attend":residential_attend,"not_attend":total_residential-residential_attend});
         
            let total_street = await Street_vendor.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }).countDocuments(); 
            let street_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date,db_type:'streetvendors'}).countDocuments();
            final_array.push({name:'Street vendor',value:street_attend,type:'Attend'});
            final_array.push({name:'Street vendor',value:total_street-street_attend,type:'Not-Attend'});   

            data_array.push({"name":'Street vendor',"attend":street_attend,"not_attend":total_street-street_attend});
        
            let total_communityhall = await Community_hall.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} , }).countDocuments(); 
            let community_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date,db_type:'communityhalls'}).countDocuments();
            final_array.push({name:'Community hall',value:community_attend,type:'Attend'});
            final_array.push({name:'Community hall',value:total_communityhall-community_attend,type:'Not-Attend'});
            
            data_array.push({"name":'Community hall',"attend":community_attend,"not_attend":total_communityhall-community_attend});
           
            let total_toilets = await Toilets.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}  }).countDocuments(); 
            let toilets_attend =  await Toiletsoperation.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date}).countDocuments();
            final_array.push({name:'Toilets',value:toilets_attend,type:'Attend'});
            final_array.push({name:'Toilets',value:total_toilets-toilets_attend,type:'Not-Attend'});


            data_array.push({"name":'Toilets',"attend":toilets_attend,"not_attend":total_toilets-toilets_attend});
        
            let total_parking = await Parking.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}  }).countDocuments();  
            let parking_attend =  await Operations.find({zones_id:{$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in: acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,date:formatted_date,db_type:'parkings'}).countDocuments();
            final_array.push({name:'Parking',value:parking_attend,type:'Attend'});
            final_array.push({name:'Parking',value:total_parking-parking_attend,type:'Not-Attend'});

            data_array.push({"name":'Parking',"attend":parking_attend,"not_attend":total_parking-parking_attend});
        
            let total_manhole = await Manhole_tree.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,type:'Man hole'}).countDocuments(); 
            let manhole_data  = await Manhole_tree.aggregate([
                {
                    "$match":{ type : 'Man hole',zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark}  }
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
            final_array.push({name:'Man hole',value:manhole_data.length,type:'Attend'});
            final_array.push({name:'Man hole',value:total_manhole-manhole_data.length,type:'Not-Attend'});

            data_array.push({"name":'Man hole',"attend":manhole_data.length,"not_attend":total_manhole-manhole_data.length});
        
            let total_tree = await Manhole_tree.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Tree'}).countDocuments(); 
            let tree_data  = await Manhole_tree.aggregate([
                {
                    "$match":{ type : 'Tree',zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }
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
        
            final_array.push({name:'Tree',value:tree_data.length,type:'Attend'});
            final_array.push({name:'Tree',value:total_tree-tree_data.length,type:'Not-Attend'});

            data_array.push({"name":'Tree',"attend":tree_data.length,"not_attend":total_tree-tree_data.length});
        
            let total_busstop = await Manhole_tree.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Bus Stop'}).countDocuments(); 
            let busstop_data  = await Manhole_tree.aggregate([
                {
                    "$match":{ type : 'Bus Stop',zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }
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
        
            final_array.push({name:'Bus Stop',value:busstop_data.length,type:'Attend'});
            final_array.push({name:'Bus Stop',value:total_busstop-busstop_data.length,type:'Not-Attend'});
            data_array.push({"name":'Bus Stop',"attend":busstop_data.length,"not_attend":total_busstop-busstop_data.length});
        
            let total_temple = await Temple.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} ,type:'Temple'}).countDocuments(); 
            let temple_data  = await Temple.aggregate([
                {
                    "$match":{ type : 'Temple',zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }
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
        
            final_array.push({name:'Temple',value:temple_data.length,type:'Attend'});
            final_array.push({name:'Temple',value:total_temple-temple_data.length,type:'Not-Attend'});
            data_array.push({"name":'Temple',"attend":temple_data.length,"not_attend":total_temple-temple_data.length});
            let total_church = await Temple.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Church'}).countDocuments(); 
            let church_data  = await Temple.aggregate([
                {
                    "$match":{ type : 'Church',zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }
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
        
            final_array.push({name:'Church',value:church_data.length,type:'Attend'}); 
            final_array.push({name:'Church',value:total_church-church_data.length,type:'Not-Attend'}); 
            data_array.push({"name":'Church',"attend":church_data.length,"not_attend":total_church-church_data.length});
            let total_masjid = await Temple.find({zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark},type:'Masjid'}).countDocuments(); 
            let masjid_data  = await Temple.aggregate([
                {
                    "$match":{ type : 'Masjid',zones_id: {$in: acc_zones},circles_id:{$in: acc_circles},ward_id:{$in:acc_wards},area_id:{$in: acc_areas},landmark_id:{$in: acc_landmark} }
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
            final_array.push({name:'Masjid',value:masjid_data.length,type:'Attend'});
            final_array.push({name:'Masjid',value:total_masjid-masjid_data.length,type:'Not-Attend'});
            data_array.push({"name":'Masjid',"attend":masjid_data.length,"not_attend":total_masjid-masjid_data.length});
            return res.status(200).send({login:true,success:true,data: final_array,data_array:data_array}); 
   }    
}