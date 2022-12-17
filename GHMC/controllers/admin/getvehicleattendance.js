const vehicles_attandance = require('../../model/vehicles_attandance'); 
const zone = require("../../model/zones");
const circle = require('../../model/circles');
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.getallvehicles_attandance = async (req, res) => {
  //  const { zones_id} = req.body;  
    let newobject ={};
    let current_datetime = new Date();
let formatted_date =   current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1)+ "-" +current_datetime.getDate()
   
    //console.log(formatted_date)
    newobject.date = formatted_date; 

 
    // console.log(z);                                   
    const alldata = await vehicles_attandance.aggregate([
        { "$match": newobject }, 
        {   
            $lookup:{ 
                from: "zones",             // other table name              // 
                localField: "zones_id",   // name of users table field     //
                foreignField: "_id",     // name of userinfo table field  // 
                as: "zones_info"        // alias for userinfo table      //
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$zones_info" }, 
        {   
            $lookup:{
                from: "circles",       // other table name  
                localField: "circles_id",   // name of users table field 
                foreignField: "_id", // name of userinfo table field    
                as: "circle_info"         // alias for userinfo table
            }  
        },// define which fields are you want to fetch    
        {   $unwind:"$circle_info" },  
        {   
            $lookup:{
                from: "wards",       // other table name
                localField: "ward_id",   // name of users table field
                foreignField: "_id", // name of userinfo table field
                as: "wards_info"         // alias for userinfo table
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$wards_info" },  
        {   
            $lookup:{
                from: "vehicles",       // other table name
                localField: "vehicle_unique_no",   // name of users table field
                foreignField: "unique_no", // name of userinfo table field
                as: "vehicle_info"         // alias for userinfo table
            } 
        },// define which fields are you want to fetch
        {   $unwind:"$vehicle_info" }, 

        {   
            $project:{ 

                _id : 1,  
                zone_name : "$zones_info.name", 
                circle_name : "$circle_info.name", 
                wardname : { $concat: [ "$wards_info.wards_no", " - ", "$wards_info.name" ] },  
                vehicle_type:1,
                scanned_address:1,
                log_date_created:1,
                date:1,
                latitude:1,
                longitude:1,
                scan_image:1,
                attandance:1,
                sfa_name:1,  
                incharge:1,
                incharge_mobile_number:1,      
                vehicle_registration_number:1,
                owner_type:1, 
                driver_name : "$vehicle_info.driver_name",
                driver_mobile : "$vehicle_info.driver_number",
                landmark:"$vehicle_info.location",
                Transfer_station:"$vehicle_info.transfer_station",
            },
            
        }
    ]);
    res.status(200).json({status:true,alldata});  
    }
       


    exports.getallvehicles_attandance_search = async (req, res) => {
        //  const { zones_id} = req.body;  
          let newobject ={};
          var dates_search; 
          if(req.body.reportrange != ''){ 

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
              let newDate = req.body.reportrange.split("-");
             const range = dateRange(new Date(newDate[0]), new Date(newDate[1]));
             let arrDate = range.map(date => date.toISOString().slice(0, 10));   
             dates_search = arrDate; 
 
             newobject.date = {$in : arrDate }; 
          }
             
          if(req.body.zones_id != ''){
              newobject.zones_id = ObjectId(req.body.zones_id); 
          } 
          if(req.body.circles_id != ''){
              newobject.circles_id = ObjectId(req.body.circles_id);
          } 
          if(req.body.attandance == 'All' && req.body.attandance == ''){ 
              newobject.attandance = {$in :[0,1] };
          } 
          if(req.body.attandance == '1'){
              newobject.attandance =  1;
          } 
          if(req.body.attandance == '0'){
              newobject.attandance =  0;
          }
          if(req.body.vehicle_type == 'All' && req.body.vehicle_type ==''){
              newobject.vehicle_type = {$in :['GHMC Swatch Auto','Private Swatch Auto'] };
          }  
          if(req.body.vehicle_type == 'Private Swatch Auto'){
              newobject.vehicle_type =  'Private Swatch Auto';
          }
          if(req.body.vehicle_type == 'GHMC Swatch Auto'){
              newobject.vehicle_type =  'GHMC Swatch Auto';
          }
         
          
          const alldata = await vehicles_attandance.aggregate([
              { "$match": newobject }, 
              {   
                  $lookup:{ 
                      from: "zones",             // other table name              // 
                      localField: "zones_id",   // name of users table field     //
                      foreignField: "_id",     // name of userinfo table field  // 
                      as: "zones_info"        // alias for userinfo table      //
                  } 
              },// define which fields are you want to fetch
              {   $unwind:"$zones_info" }, 
              {   
                  $lookup:{
                      from: "circles",       // other table name  
                      localField: "circles_id",   // name of users table field 
                      foreignField: "_id", // name of userinfo table field    
                      as: "circle_info"         // alias for userinfo table
                  }  
              },// define which fields are you want to fetch    
              {   $unwind:"$circle_info" },  
              {   
                  $lookup:{
                      from: "wards",       // other table name
                      localField: "ward_id",   // name of users table field
                      foreignField: "_id", // name of userinfo table field
                      as: "wards_info"         // alias for userinfo table
                  } 
              },// define which fields are you want to fetch
              {   $unwind:"$wards_info" },  
              {   
                  $lookup:{
                      from: "vehicles",       // other table name
                      localField: "vehicle_unique_no",   // name of users table field
                      foreignField: "unique_no", // name of userinfo table field
                      as: "vehicle_info"         // alias for userinfo table
                  } 
              },// define which fields are you want to fetch
              {   $unwind:"$vehicle_info" }, 
      
              {   
                  $project:{ 
      
                      _id : 1,  
                      zone_name : "$zones_info.name", 
                      circle_name : "$circle_info.name", 
                      wardname : { $concat: [ "$wards_info.wards_no", " - ", "$wards_info.name" ] },  
                      vehicle_type:1,
                      scanned_address:1,
                      log_date_created:1,
                      date:1,
                      latitude:1,
                      longitude:1,
                      scan_image:1,
                      attandance:1,
                      sfa_name:1,  
                      incharge:1,
                      incharge_mobile_number:1,      
                      vehicle_registration_number:1,
                      owner_type:1, 
                      driver_name : "$vehicle_info.driver_name",
                      driver_mobile : "$vehicle_info.driver_number",
                      landmark:"$vehicle_info.location",
                      Transfer_station:"$vehicle_info.transfer_station",
                  },
                  
              }
          ]);
          
         // let newobject1 ={}; 
          newobject.date =  dates_search[0];  
          const alldatafinal = await vehicles_attandance.aggregate([ 
            { "$match": newobject }, 
            {   
                $lookup:{ 
                    from: "zones",             // other table name              // 
                    localField: "zones_id",   // name of users table field     //
                    foreignField: "_id",     // name of userinfo table field  // 
                    as: "zones_info"        // alias for userinfo table      //
                } 
            },// define which fields are you want to fetch
            {   $unwind:"$zones_info" }, 
            {   
                $lookup:{
                    from: "circles",       // other table name  
                    localField: "circles_id",   // name of users table field 
                    foreignField: "_id", // name of userinfo table field    
                    as: "circle_info"         // alias for userinfo table
                }  
            },// define which fields are you want to fetch    
            {   $unwind:"$circle_info" },  
            {   
                $lookup:{
                    from: "wards",       // other table name
                    localField: "ward_id",   // name of users table field
                    foreignField: "_id", // name of userinfo table field
                    as: "wards_info"         // alias for userinfo table
                } 
            },// define which fields are you want to fetch
            {   $unwind:"$wards_info" },  
            {   
                $lookup:{
                    from: "vehicles",       // other table name
                    localField: "vehicle_unique_no",   // name of users table field
                    foreignField: "unique_no", // name of userinfo table field
                    as: "vehicle_info"         // alias for userinfo table
                } 
            },// define which fields are you want to fetch
            {   $unwind:"$vehicle_info" }, 
    
            {   
                $project:{ 
    
                    _id : 1,  
                    zone_name : "$zones_info.name", 
                    circle_name : "$circle_info.name", 
                    wardname : { $concat: [ "$wards_info.wards_no", " - ", "$wards_info.name" ] },  
                    vehicle_type:1,
                    scanned_address:1,
                    log_date_created:1,
                    date:1,
                    latitude:1,
                    longitude:1,
                    scan_image:1,
                    attandance:1,
                    sfa_name:1, 
                    incharge:1, 
                    incharge_mobile_number:1,      
                    vehicle_registration_number:1,
                    owner_type:1, 
                    driver_name : "$vehicle_info.driver_name",
                    driver_mobile : "$vehicle_info.driver_number",
                    landmark:"$vehicle_info.location",
                    Transfer_station:"$vehicle_info.transfer_station",
                },
                
            }
        ]);
            // console.log(alldatafinal);
           //  console.log(alldata); 

           let table_obj =[];
           table_obj.push('Zone name');
           table_obj.push('Circle name');
           table_obj.push('Ward ');
           table_obj.push('Incharge');
           table_obj.push('Incharge Mobile No.');
           table_obj.push('Vehicle Registration No.');
           table_obj.push('Owner type');
           table_obj.push('Vehicle type');
           table_obj.push('Driver Name');
           table_obj.push('Driver No');
           table_obj.push('Landmark');
           table_obj.push('Transfer station');
           dates_search.forEach((da,dind)=>{
            table_obj.push(da);
           });
           table_obj.push('Address');
           table_obj.push('Latitude');
           table_obj.push('Longitude');
           table_obj.push('Image');

           let finalarray = []; 
           var r
           alldatafinal.forEach((val,ind)=>{
                
               
                
                var oj = {zone_name: val.zone_name,circle_name: val.circle_name,wardname: val.wardname,incharge:'',
                incharge_mobile_number:val.incharge_mobile_number,vehicle_registration_number:val.vehicle_registration_number,
                owner_type:val.owner_type,vehicle_type:val.vehicle_type,driver_name:val.driver_name,driver_mobile:val.driver_mobile,
                landmark:val.landmark,Transfer_station:val.Transfer_station}; 
            r = {}; 
            dates_search.forEach((da,dind)=>{
               
                  alldata.filter(function(v, i) {
                     if(v.date == da  && v.vehicle_registration_number == val.vehicle_registration_number){
                       
                         r[da] = v.attandance; 
                     }else{
                        r[da] = 0;
                     }
                  })
            })
           
            var oj1 = {scanned_address:val.scanned_address,latitude:val.latitude,longitude:val.longitude,scan_image:val.scan_image}
            finalarray.push({...oj,...r,...oj1 });  
          })   
          

          return res.status(200).send({status:true,data:finalarray,table:table_obj}) 
          
 }

